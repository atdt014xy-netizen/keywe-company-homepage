import { beforeEach, afterEach, describe, expect, it } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { Session } from "@shopify/shopify-api";
import { readFile } from "node:fs/promises";
import { createHmac } from "node:crypto";
import type { DB } from "../server/db";
import { embeddedDB } from "../server/pglite-adapter";
import {
  install,
  issueLink,
  redeemLink,
  requireMember,
  applySnapshot,
  acceptWebhook,
  summary,
  registerDevice,
} from "../server/store";
import { validWebhook, encrypt, decrypt } from "../server/security";
import {
  stockTransition,
  stockStatus,
  quietNow,
  canCreateDiscount,
} from "../server/domain";
import { claim, failJob } from "../server/queue";
let pg: PGlite, db: DB;
const shop = "alpha.myshopify.com",
  other = "beta.myshopify.com",
  location = "gid://shopify/Location/1";
const stock = (quantity: number, second = 0) => ({
  item_id: "gid://shopify/InventoryItem/1",
  location_id: location,
  product_id: "gid://shopify/Product/1",
  variant_id: "gid://shopify/ProductVariant/1",
  title: "Mug",
  variant: "Blue",
  location_name: "Seoul",
  image: null,
  tracked: true,
  available: quantity,
  source_at: new Date(
    `2026-10-02T12:00:${second.toString().padStart(2, "0")}Z`,
  ),
});
beforeEach(async () => {
  process.env.TOKEN_ENCRYPTION_KEY = Buffer.alloc(32, 1).toString("base64");
  pg = new PGlite();
  db = embeddedDB(pg);
  await pg.exec(
    await readFile(new URL("../server/schema.sql", import.meta.url), "utf8"),
  );
  await install(db, shop);
  await install(db, other);
  await db.query("UPDATE shops SET selected_location=$1 WHERE shop=$2", [
    location,
    shop,
  ]);
});
afterEach(async () => {
  await pg.close();
});
describe("Tenant authorization and account linking", () => {
  it("preserves offline token expiry and refresh data across encrypted serialization", () => {
    const session = new Session({
      id: "offline_alpha",
      shop,
      state: "",
      isOnline: false,
      accessToken: "test-access",
      refreshToken: "test-refresh",
      expires: new Date(Date.now() - 1000),
      refreshTokenExpires: new Date(Date.now() + 86400000),
    });
    const restored = Session.fromPropertyArray(
      JSON.parse(
        decrypt(encrypt(JSON.stringify(session.toPropertyArray(false)))),
      ),
    );
    expect(restored.isExpired()).toBe(true);
    expect(restored.refreshToken).toBe("test-refresh");
    expect(restored.refreshTokenExpires?.getTime()).toBe(
      session.refreshTokenExpires?.getTime(),
    );
  });
  it("blocks another store, wrong account and wrong shop; consumes a code once", async () => {
    const code = await issueLink(db, shop, "user1");
    await expect(redeemLink(db, "user2", shop, code)).rejects.toThrow();
    await expect(redeemLink(db, "user1", other, code)).rejects.toThrow();
    await redeemLink(db, "user1", shop, code);
    await expect(redeemLink(db, "user1", shop, code)).rejects.toThrow();
    expect((await requireMember(db, "user1", shop)).shop).toBe(shop);
    await expect(requireMember(db, "user1", other)).rejects.toThrow();
  });
  it("rejects expired codes at the exact boundary", async () => {
    const now = new Date("2026-01-01T00:00:00Z");
    const code = await issueLink(db, shop, "user1", now);
    await expect(
      redeemLink(db, "user1", shop, code, new Date(now.getTime() + 300000)),
    ).rejects.toThrow();
  });
  it("encrypts secrets with unique authenticated ciphertext", () => {
    const a = encrypt("secret"),
      b = encrypt("secret");
    expect(a).not.toBe(b);
    expect(a).not.toContain("secret");
    expect(decrypt(a)).toBe("secret");
    expect(() => decrypt(a.slice(0, -3) + "abc")).toThrow();
  });
  it("uninstall revokes members, devices, sessions, queued work and old codes", async () => {
    const c = await issueLink(db, shop, "user1");
    await redeemLink(db, "user1", shop, c);
    const stale = await issueLink(db, shop, "user1");
    await registerDevice(db, "user1", shop, "device-token-1234567890123456");
    await db.query("INSERT INTO sessions(id,shop,data) VALUES($1,$2,$3)", [
      "offline",
      shop,
      encrypt("token"),
    ]);
    await acceptWebhook(db, shop, "e1", "inventory_levels/update", {});
    await acceptWebhook(db, shop, "uninstall", "app/uninstalled", {});
    await expect(requireMember(db, "user1", shop)).rejects.toThrow();
    expect((await db.query("SELECT * FROM sessions")).rows).toHaveLength(0);
    expect((await db.query("SELECT * FROM devices")).rows).toHaveLength(0);
    expect((await db.query("SELECT state FROM jobs")).rows[0].state).toBe(
      "cancelled",
    );
    await install(db, shop);
    await expect(redeemLink(db, "user1", shop, stale)).rejects.toThrow();
  });
});
describe("Inventory and delivery rules", () => {
  it("5→4 alerts once, 4→3→2 does not repeat; restock permits next alert; zero is separate", async () => {
    for (const [i, q] of [5, 4, 3, 2, 7, 4, 0, 0, -1].entries())
      await applySnapshot(db, shop, stock(q, i), false);
    const { rows } = await db.query(
      "SELECT kind,quantity FROM alerts ORDER BY created_at",
    );
    expect(rows.map((x) => x.kind)).toEqual(["low", "low", "out"]);
    expect(rows.map((x) => x.quantity)).toEqual([4, 4, 0]);
  });
  it("does not treat untracked inventory as zero", async () => {
    await applySnapshot(db, shop, stock(5), false);
    await applySnapshot(
      db,
      shop,
      { ...stock(0, 1), tracked: false, available: null },
      false,
    );
    expect((await db.query("SELECT * FROM alerts")).rows).toHaveLength(0);
    expect(stockStatus({ tracked: false, available: 0 })).toBe("untracked");
  });
  it("deduplicates webhooks and rejects reverse snapshots", async () => {
    expect(
      await acceptWebhook(db, shop, "same", "inventory_levels/update", {}),
    ).toBe("accepted");
    expect(
      await acceptWebhook(db, shop, "same", "inventory_levels/update", {}),
    ).toBe("duplicate");
    expect((await db.query("SELECT * FROM jobs")).rows).toHaveLength(1);
    await applySnapshot(db, shop, stock(5, 1), false);
    await applySnapshot(db, shop, stock(4, 3), false);
    await applySnapshot(db, shop, stock(9, 2), false);
    expect(
      (await db.query("SELECT available FROM inventory")).rows[0].available,
    ).toBe(4);
    expect((await db.query("SELECT * FROM alerts")).rows).toHaveLength(1);
  });
  it("keeps tenant and location quantities separate", async () => {
    await applySnapshot(db, shop, stock(4), false);
    await applySnapshot(
      db,
      shop,
      { ...stock(20), location_id: "gid://shopify/Location/2" },
      false,
    );
    await db.query("UPDATE shops SET selected_location=$1 WHERE shop=$2", [
      location,
      other,
    ]);
    await applySnapshot(db, other, stock(12), false);
    expect(
      (await db.query("SELECT available FROM inventory WHERE shop=$1", [shop]))
        .rows,
    ).toEqual([{ available: 4 }]);
  });
  it("initial low inventory produces one summary rather than a burst", async () => {
    await applySnapshot(db, shop, stock(4), true);
    await applySnapshot(
      db,
      shop,
      { ...stock(0), item_id: "gid://shopify/InventoryItem/2" },
      true,
    );
    expect((await db.query("SELECT * FROM alerts")).rows).toHaveLength(0);
    await summary(db, shop, "initial");
    const { rows } = await db.query("SELECT kind,quantity FROM alerts");
    expect(rows).toEqual([{ kind: "initial", quantity: 2 }]);
  });
  it("quiet hours keep the inbox and suppress immediate push", async () => {
    await db.query(
      "UPDATE shops SET timezone='Asia/Seoul',quiet_enabled=true,quiet_start=1320,quiet_end=480 WHERE shop=$1",
      [shop],
    );
    await applySnapshot(db, shop, stock(5), false);
    await applySnapshot(
      db,
      shop,
      stock(4, 1),
      false,
      new Date("2026-10-02T14:00:00Z"),
    );
    expect((await db.query("SELECT push_state FROM alerts")).rows).toEqual([
      { push_state: "quiet" },
    ]);
    expect((await db.query("SELECT * FROM jobs")).rows).toHaveLength(0);
    await applySnapshot(db, shop, stock(9, 2), false);
    await summary(db, shop, "digest");
    expect((await db.query("SELECT * FROM alerts")).rows).toHaveLength(1);
  });
  it("supports per-variant thresholds and disabled alerts", async () => {
    await applySnapshot(db, shop, stock(10), false);
    await db.query("UPDATE inventory SET threshold=8 WHERE shop=$1", [shop]);
    await applySnapshot(db, shop, stock(7, 1), false);
    expect((await db.query("SELECT * FROM alerts")).rows).toHaveLength(1);
    await db.query("UPDATE inventory SET enabled=false WHERE shop=$1", [shop]);
    await applySnapshot(db, shop, stock(0, 2), false);
    expect((await db.query("SELECT * FROM alerts")).rows).toHaveLength(1);
  });
});
describe("Signatures, timezones and entitlement", () => {
  it("leases durable jobs, retries with backoff and records exhausted failures", async () => {
    await acceptWebhook(db, shop, "retry", "inventory_levels/update", {});
    const first = await claim(db);
    expect(first.attempts).toBe(1);
    expect(await claim(db)).toBeUndefined();
    await failJob(db, first);
    expect(await claim(db)).toBeUndefined();
    await db.query(
      "UPDATE jobs SET run_at=now()-interval '1 second',attempts=7 WHERE id=$1",
      [first.id],
    );
    const last = await claim(db);
    await failJob(db, last);
    const {
      rows: [row],
    } = await db.query("SELECT * FROM jobs WHERE id=$1", [first.id]);
    expect(row.state).toBe("failed");
    expect(row.error).toContain("SYNC_FAILED");
  });
  it("recovers expired leases and rejects a stale worker failure update", async () => {
    await acceptWebhook(db, shop, "lease", "inventory_levels/update", {});
    const first = await claim(db);
    await db.query(
      "UPDATE jobs SET lease_until=now()-interval '1 second' WHERE id=$1",
      [first.id],
    );
    const second = await claim(db);
    expect(second.lease_token).not.toBe(first.lease_token);
    await failJob(db, first);
    expect((await db.query("SELECT state FROM jobs")).rows[0].state).toBe(
      "running",
    );
  });
  it("validates exact raw bytes, rejects tampering and malformed signatures", () => {
    const raw = Buffer.from('{ "available": 4 }'),
      secret = "test-secret";
    const sig = createHmac("sha256", secret).update(raw).digest("base64");
    expect(validWebhook(raw, sig, secret)).toBe(true);
    expect(validWebhook(Buffer.from('{"available":4}'), sig, secret)).toBe(
      false,
    );
    expect(validWebhook(raw, "bad", secret)).toBe(false);
  });
  it("uses IANA zones, overnight boundaries and DST", () => {
    expect(
      quietNow(new Date("2026-10-02T13:00:00Z"), "Asia/Seoul", 1320, 480, true),
    ).toBe(true);
    expect(
      quietNow(new Date("2026-10-02T23:00:00Z"), "Asia/Seoul", 1320, 480, true),
    ).toBe(false);
    expect(
      quietNow(
        new Date("2026-11-01T06:30:00Z"),
        "America/New_York",
        60,
        120,
        true,
      ),
    ).toBe(true);
    expect(quietNow(new Date(), "UTC", 60, 60, true)).toBe(false);
  });
  it("expired/unverified subscription cannot grant new discounts", () => {
    expect(canCreateDiscount("expired", new Date(), false)).toBe(false);
    expect(canCreateDiscount("active", null, false)).toBe(false);
    expect(canCreateDiscount("free_development", null, false)).toBe(false);
    expect(canCreateDiscount("free_development", null, true)).toBe(true);
    expect(
      stockTransition(
        { tracked: true, available: 5 },
        { tracked: true, available: 0 },
        5,
      ),
    ).toBe("out");
  });
});
