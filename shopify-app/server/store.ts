import { randomUUID } from "node:crypto";
import type { DB } from "./db";
import { lockShop } from "./db";
import { ApiError, hash, secretCode, encrypt } from "./security";
import { quietNow, stockTransition } from "./domain";

export async function requireMember(db: DB, uid: string, shop: string) {
  const { rows } = await db.query(
    "SELECT s.* FROM shops s JOIN members m ON m.shop=s.shop WHERE m.uid=$1 AND s.shop=$2 AND s.active=true",
    [uid, shop],
  );
  if (!rows[0]) throw new ApiError(403, "Store access denied or disconnected");
  return rows[0];
}
export async function install(db: DB, shop: string) {
  await db.query(
    `INSERT INTO shops(shop) VALUES($1) ON CONFLICT(shop) DO UPDATE SET active=true,
    generation=CASE WHEN shops.active THEN shops.generation ELSE shops.generation+1 END`,
    [shop],
  );
}
export async function issueLink(
  db: DB,
  shop: string,
  uid: string,
  now = new Date(),
) {
  if (!/^[A-Za-z0-9:_-]{1,128}$/.test(uid))
    throw new ApiError(400, "Invalid mobile account ID");
  return db.transaction(async (tx) => {
    await lockShop(tx, shop);
    const {
      rows: [s],
    } = await tx.query("SELECT * FROM shops WHERE shop=$1 AND active=true", [
      shop,
    ]);
    if (!s) throw new ApiError(403, "Store disconnected");
    const code = secretCode();
    await tx.query("DELETE FROM link_codes WHERE shop=$1 AND uid=$2", [
      shop,
      uid,
    ]);
    await tx.query(
      "INSERT INTO link_codes(hash,shop,uid,generation,expires_at) VALUES($1,$2,$3,$4,$5)",
      [
        hash(code),
        shop,
        uid,
        s.generation,
        new Date(now.getTime() + 5 * 60_000),
      ],
    );
    return code;
  });
}
export async function redeemLink(
  db: DB,
  uid: string,
  shop: string,
  code: string,
  now = new Date(),
) {
  return db.transaction(async (tx) => {
    await lockShop(tx, shop);
    const { rows } = await tx.query(
      `UPDATE link_codes c SET used_at=$4 FROM shops s
      WHERE c.hash=$1 AND c.uid=$2 AND c.shop=$3 AND c.shop=s.shop AND s.active=true
      AND c.generation=s.generation AND c.used_at IS NULL AND c.expires_at>$4 RETURNING c.shop`,
      [hash(code), uid, shop, now],
    );
    if (!rows[0])
      throw new ApiError(400, "Invalid, expired, or used connection code");
    await tx.query(
      "INSERT INTO members(uid,shop) VALUES($1,$2) ON CONFLICT DO NOTHING",
      [uid, shop],
    );
    return { shop };
  });
}
export async function enqueue(
  db: DB,
  shop: string,
  kind: string,
  payload: object = {},
  dedupe?: string,
  runAt = new Date(),
) {
  await db.query(
    `INSERT INTO jobs(id,shop,generation,kind,payload,dedupe,run_at)
    SELECT $1,shop,generation,$3,$4::jsonb,$5,$6 FROM shops WHERE shop=$2 AND active=true
    ON CONFLICT(dedupe) DO NOTHING`,
    [randomUUID(), shop, kind, JSON.stringify(payload), dedupe ?? null, runAt],
  );
}
export async function uninstall(db: DB, shop: string) {
  await lockShop(db, shop);
  await db.query(
    `UPDATE shops SET active=false, generation=generation+1, sync_error='Uninstalled', initial_complete=false WHERE shop=$1`,
    [shop],
  );
  await db.query(
    "UPDATE jobs SET state='cancelled',lease_token=NULL WHERE shop=$1 AND state IN ('queued','running')",
    [shop],
  );
  for (const table of ["sessions", "devices", "members", "link_codes"])
    await db.query(`DELETE FROM ${table} WHERE shop=$1`, [shop]);
  await db.query(
    "UPDATE alerts SET push_state='cancelled' WHERE shop=$1 AND push_state IN ('pending','quiet')",
    [shop],
  );
}
export async function acceptWebhook(
  db: DB,
  shop: string,
  event: string,
  topic: string,
  payload: Record<string, unknown>,
) {
  return db.transaction(async (tx) => {
    const {
      rows: [receipt],
    } = await tx.query(
      "INSERT INTO webhook_receipts(shop,event_id,topic) VALUES($1,$2,$3) ON CONFLICT DO NOTHING RETURNING event_id",
      [shop, event, topic],
    );
    if (!receipt) return "duplicate";
    if (topic === "app/uninstalled") {
      await uninstall(tx, shop);
      return "accepted";
    }
    if (topic === "shop/redact") {
      await uninstall(tx, shop);
      await tx.query("DELETE FROM shops WHERE shop=$1", [shop]);
      await tx.query("DELETE FROM audit WHERE shop=$1", [shop]);
      await tx.query("DELETE FROM webhook_receipts WHERE shop=$1", [shop]);
      return "accepted";
    }
    if (topic === "customers/data_request" || topic === "customers/redact")
      return "no_customer_data";
    if (
      topic === "inventory_levels/update" ||
      topic === "inventory_items/update" ||
      topic === "products/update" ||
      topic === "app/scopes_update"
    ) {
      // Webhook quantities are never authoritative. Re-read selected location under tenant lock.
      await enqueue(
        tx,
        shop,
        "sync",
        { trigger: topic, item: payload.inventory_item_id ?? null },
        `${shop}:${event}`,
      );
    }
    return "accepted";
  });
}
export interface Snapshot {
  item_id: string;
  location_id: string;
  product_id: string;
  variant_id: string;
  title: string;
  variant: string;
  location_name: string;
  image: string | null;
  tracked: boolean;
  available: number | null;
  source_at: Date;
}
export async function applySnapshot(
  tx: DB,
  shop: string,
  next: Snapshot,
  initial: boolean,
  now = new Date(),
) {
  const {
    rows: [s],
  } = await tx.query("SELECT * FROM shops WHERE shop=$1 AND active=true", [
    shop,
  ]);
  if (!s || s.selected_location !== next.location_id) return false;
  const {
    rows: [before],
  } = await tx.query(
    "SELECT * FROM inventory WHERE shop=$1 AND item_id=$2 AND location_id=$3",
    [shop, next.item_id, next.location_id],
  );
  if (before && new Date(before.source_at) > next.source_at) {
    // The item was present in this reconciliation; don't prune it as missing.
    await tx.query(
      "UPDATE inventory SET observed_at=$4 WHERE shop=$1 AND item_id=$2 AND location_id=$3",
      [shop, next.item_id, next.location_id, now],
    );
    return false;
  }
  const threshold = before?.threshold ?? s.threshold;
  const kind = stockTransition(
    before
      ? { tracked: before.tracked, available: before.available }
      : undefined,
    next,
    threshold,
  );
  await tx.query(
    `INSERT INTO inventory(shop,item_id,location_id,product_id,variant_id,title,variant,location_name,image,tracked,available,source_at,observed_at)
    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
    ON CONFLICT(shop,item_id,location_id) DO UPDATE SET product_id=EXCLUDED.product_id,variant_id=EXCLUDED.variant_id,title=EXCLUDED.title,
    variant=EXCLUDED.variant,location_name=EXCLUDED.location_name,image=EXCLUDED.image,tracked=EXCLUDED.tracked,available=EXCLUDED.available,
    source_at=EXCLUDED.source_at,observed_at=EXCLUDED.observed_at`,
    [
      shop,
      next.item_id,
      next.location_id,
      next.product_id,
      next.variant_id,
      next.title,
      next.variant,
      next.location_name,
      next.image,
      next.tracked,
      next.available,
      next.source_at,
      now,
    ],
  );
  if (kind && !initial && before?.enabled !== false) {
    const quiet = quietNow(
      now,
      s.timezone,
      s.quiet_start,
      s.quiet_end,
      s.quiet_enabled,
    );
    const id = randomUUID();
    await tx.query(
      "INSERT INTO alerts(id,shop,item_id,location_id,kind,title,quantity,created_at,push_state) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)",
      [
        id,
        shop,
        next.item_id,
        next.location_id,
        kind,
        next.title,
        next.available,
        now,
        quiet ? "quiet" : "pending",
      ],
    );
    if (!quiet) await enqueue(tx, shop, "push", { alertId: id }, `alert:${id}`);
  }
  return true;
}
export async function summary(
  tx: DB,
  shop: string,
  kind: "initial" | "digest",
) {
  const {
    rows: [s],
  } = await tx.query("SELECT * FROM shops WHERE shop=$1 AND active=true", [
    shop,
  ]);
  if (!s) return;
  const {
    rows: [n],
  } = await tx.query(
    `SELECT count(*)::int AS count FROM inventory WHERE shop=$1 AND location_id=$2 AND tracked=true AND enabled=true AND available<COALESCE(threshold,$3)`,
    [shop, s.selected_location, s.threshold],
  );
  if (n.count > 0) {
    const id = randomUUID();
    const quiet = quietNow(
      new Date(),
      s.timezone,
      s.quiet_start,
      s.quiet_end,
      s.quiet_enabled,
    );
    await tx.query(
      "INSERT INTO alerts(id,shop,kind,title,quantity,push_state) VALUES($1,$2,$3,$4,$5,$6)",
      [
        id,
        shop,
        kind,
        `${n.count} variants need attention`,
        n.count,
        quiet ? "quiet" : "pending",
      ],
    );
    if (!quiet) await enqueue(tx, shop, "push", { alertId: id }, `alert:${id}`);
  }
}
export async function registerDevice(
  tx: DB,
  uid: string,
  shop: string,
  token: string,
) {
  await requireMember(tx, uid, shop);
  await tx.query(
    `INSERT INTO devices(token_hash,token,uid,shop) VALUES($1,$2,$3,$4)
    ON CONFLICT(token_hash) DO UPDATE SET token=EXCLUDED.token,uid=EXCLUDED.uid,shop=EXCLUDED.shop,updated_at=now()`,
    [hash(token), encrypt(token), uid, shop],
  );
}
