import "dotenv/config";
import { claim, failJob } from "./queue";
import { db, lockShop, closeDB } from "./db";
import type { DB } from "./db";
import { applySnapshot, enqueue, summary } from "./store";
import { snapshots } from "./shopify-gateway";
import { quietNow } from "./domain";
import { messaging } from "./firebase";
import { decrypt } from "./security";

async function push(tx: DB, shop: string, alertId: string) {
  const {
    rows: [a],
  } = await tx.query("SELECT * FROM alerts WHERE shop=$1 AND id=$2", [
    shop,
    alertId,
  ]);
  const {
    rows: [s],
  } = await tx.query("SELECT * FROM shops WHERE shop=$1 AND active=true", [
    shop,
  ]);
  if (!a || !s || a.push_state !== "pending") return;
  if (a.location_id && a.location_id !== s.selected_location) {
    await tx.query("UPDATE alerts SET push_state='superseded' WHERE id=$1", [
      a.id,
    ]);
    return;
  }
  if (
    quietNow(
      new Date(),
      s.timezone,
      s.quiet_start,
      s.quiet_end,
      s.quiet_enabled,
    )
  ) {
    await tx.query("UPDATE alerts SET push_state='quiet' WHERE id=$1", [a.id]);
    return;
  }
  const { rows: devices } = await tx.query(
    "SELECT d.* FROM devices d JOIN members m ON m.uid=d.uid AND m.shop=d.shop WHERE d.shop=$1",
    [shop],
  );
  if (!devices.length) {
    await tx.query("UPDATE alerts SET push_state='no_device' WHERE id=$1", [
      a.id,
    ]);
    return;
  }
  let accepted = 0;
  for (const d of devices) {
    try {
      await messaging().send({
        token: decrypt(d.token),
        notification: {
          title: a.kind === "out" ? "Out of stock" : "Inventory alert",
          body: a.title,
        },
        data: {
          shop,
          alertId: a.id,
          itemId: a.item_id ?? "",
          locationId: a.location_id ?? "",
        },
        android: { priority: "high", notification: { tag: a.id } },
      });
      accepted++;
    } catch (e) {
      if (
        [
          "messaging/registration-token-not-registered",
          "messaging/invalid-registration-token",
        ].includes(
          e && typeof e === "object" && "code" in e ? String(e.code) : "",
        )
      )
        await tx.query("DELETE FROM devices WHERE token_hash=$1", [
          d.token_hash,
        ]);
      else throw new Error("FCM_SEND_FAILED");
    }
  }
  // Accepted by FCM is not evidence of device receipt. Network retries may redeliver;
  // notification tag + mobile alertId deduplication mitigate at-least-once delivery.
  await tx.query("UPDATE alerts SET push_state=$2 WHERE id=$1", [
    a.id,
    accepted > 0 ? "fcm_accepted" : "no_valid_device",
  ]);
}
export async function workOne() {
  const job = await claim(db);
  if (!job) return false;
  try {
    await db.transaction(async (tx) => {
      await lockShop(tx, job.shop);
      const {
        rows: [s],
      } = await tx.query(
        "SELECT * FROM shops WHERE shop=$1 AND active=true AND generation=$2",
        [job.shop, job.generation],
      );
      if (!s) {
        await tx.query(
          "UPDATE jobs SET state='cancelled' WHERE id=$1 AND lease_token=$2",
          [job.id, job.lease_token],
        );
        return;
      }
      const {
        rows: [owned],
      } = await tx.query(
        "SELECT id FROM jobs WHERE id=$1 AND lease_token=$2 AND state=$3",
        [job.id, job.lease_token, "running"],
      );
      if (!owned) return;
      if (job.kind === "sync" || job.kind === "digest") {
        if (!s.selected_location) {
          await tx.query(
            "UPDATE jobs SET state='done' WHERE id=$1 AND lease_token=$2",
            [job.id, job.lease_token],
          );
          return;
        }
        const began = new Date();
        for await (const page of snapshots(job.shop, s.selected_location))
          for (const item of page)
            await applySnapshot(tx, job.shop, item, !s.initial_complete);
        // Remove absent items only after a complete successful paginated snapshot.
        await tx.query(
          "DELETE FROM inventory WHERE shop=$1 AND location_id=$2 AND observed_at<$3",
          [job.shop, s.selected_location, began],
        );
        if (!s.initial_complete) await summary(tx, job.shop, "initial");
        await tx.query(
          "UPDATE shops SET synced_at=now(),sync_error=NULL,initial_complete=true WHERE shop=$1",
          [job.shop],
        );
        if (
          job.kind === "digest" &&
          !quietNow(
            new Date(),
            s.timezone,
            s.quiet_start,
            s.quiet_end,
            s.quiet_enabled,
          )
        ) {
          const { rows: pending } = await tx.query(
            "UPDATE alerts SET push_state='summarized' WHERE shop=$1 AND push_state='quiet' RETURNING id",
            [s.shop],
          );
          if (pending.length) await summary(tx, job.shop, "digest");
        }
      } else if (job.kind === "push")
        await push(tx, job.shop, job.payload.alertId);
      else throw new Error("UNKNOWN_JOB");
      await tx.query(
        "UPDATE jobs SET state='done',lease_until=NULL WHERE id=$1 AND lease_token=$2",
        [job.id, job.lease_token],
      );
    });
  } catch {
    await failJob(db, job);
    if (job.kind === "sync" || job.kind === "digest")
      await db.query(
        "UPDATE shops SET sync_error='Sync failed; reconnect or check worker' WHERE shop=$1 AND active=true",
        [job.shop],
      );
  }
  return true;
}
export async function schedule() {
  const { rows } = await db.query("SELECT * FROM shops WHERE active=true");
  for (const s of rows)
    await db.transaction(async (tx) => {
      await lockShop(tx, s.shop);
      const bucket = Math.floor(Date.now() / (15 * 60_000));
      await enqueue(
        tx,
        s.shop,
        "sync",
        {},
        `reconcile:${s.shop}:${s.generation}:${bucket}`,
      );
      if (
        !quietNow(
          new Date(),
          s.timezone,
          s.quiet_start,
          s.quiet_end,
          s.quiet_enabled,
        )
      ) {
        const { rows: pending } = await tx.query(
          "SELECT id FROM alerts WHERE shop=$1 AND push_state='quiet' LIMIT 1",
          [s.shop],
        );
        if (pending.length)
          await enqueue(
            tx,
            s.shop,
            "digest",
            {},
            `digest:${s.shop}:${s.generation}:${Math.floor(Date.now() / 60_000)}`,
          );
      }
    });
  await db.query(
    "DELETE FROM link_codes WHERE expires_at<now()-interval '1 day'",
  );
  await db.query(
    "DELETE FROM webhook_receipts WHERE received_at<now()-interval '7 days'",
  );
  await db.query(
    "DELETE FROM jobs WHERE state IN ('done','cancelled') AND created_at<now()-interval '7 days'",
  );
}
let stopping = false;
process.on("SIGINT", () => {
  stopping = true;
});
process.on("SIGTERM", () => {
  stopping = true;
});
if (process.argv[1]?.endsWith("worker.ts")) {
  console.log("StoreControl worker started");
  let scheduled = 0;
  while (!stopping) {
    try {
      if (Date.now() - scheduled > 60_000) {
        await schedule();
        scheduled = Date.now();
      }
      if (!(await workOne())) await new Promise((r) => setTimeout(r, 1000));
    } catch {
      console.error("WORKER_DATABASE_UNAVAILABLE");
      await new Promise((r) => setTimeout(r, 5000));
    }
  }
  await closeDB();
}
