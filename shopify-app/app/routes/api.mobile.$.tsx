import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { z } from "zod";
import { DateTime } from "luxon";
import { db, lockShop } from "../../server/db";
import { identity } from "../../server/firebase";
import { ApiError, hash, shopDomain } from "../../server/security";
import {
  enqueue,
  redeemLink,
  registerDevice,
  requireMember,
} from "../../server/store";
const gid = z.string().regex(/^gid:\/\/shopify\/[A-Za-z]+\/\d+$/);
async function handle(request: Request, operation: string) {
  try {
    const uid = await identity(request);
    const url = new URL(request.url);
    const body =
      request.method === "GET"
        ? Object.fromEntries(url.searchParams)
        : await request.json();
    if (operation === "stores" && request.method === "GET") {
      const { rows } = await db.query(
        "SELECT s.* FROM shops s JOIN members m ON s.shop=m.shop WHERE m.uid=$1 AND s.active=true",
        [uid],
      );
      return Response.json(
        { mode: "live", stores: rows },
        { headers: { "Cache-Control": "no-store" } },
      );
    }
    const shop = shopDomain(z.string().parse(body.shop));
    if (operation === "link" && request.method === "POST") {
      const result = await redeemLink(
        db,
        uid,
        shop,
        z.string().min(20).max(100).parse(body.code),
      );
      return Response.json(result);
    }
    return await db.transaction(async (tx) => {
      await lockShop(tx, shop);
      const s = await requireMember(tx, uid, shop);
      let result: unknown;
      if (operation === "overview" && request.method === "GET") {
        const { rows: inventory } = await tx.query(
          "SELECT * FROM inventory WHERE shop=$1 AND location_id=$2 ORDER BY tracked DESC,available ASC NULLS LAST,title",
          [shop, s.selected_location],
        );
        const { rows: discounts } = await tx.query(
          "SELECT id,state,variant_id,percent,ends_at,banner_state FROM discounts WHERE shop=$1 ORDER BY created_at DESC LIMIT 100",
          [shop],
        );
        result = {
          mode: "live",
          store: s,
          inventory,
          discounts,
          stale:
            !s.synced_at ||
            Date.now() - new Date(s.synced_at).getTime() > 30 * 60_000,
        };
      } else if (operation === "alerts" && request.method === "GET") {
        const { rows } = await tx.query(
          `SELECT a.*,i.available AS current_quantity,i.location_name,i.variant FROM alerts a
          LEFT JOIN inventory i ON i.shop=a.shop AND i.item_id=a.item_id AND i.location_id=a.location_id
          WHERE a.shop=$1 ORDER BY a.created_at DESC LIMIT 300`,
          [shop],
        );
        result = { alerts: rows };
      } else if (operation === "settings" && request.method === "POST") {
        const v = z
          .object({
            threshold: z.number().int().min(1).max(100000),
            timezone: z
              .string()
              .refine((x) => DateTime.now().setZone(x).isValid),
            quiet_start: z.number().int().min(0).max(1439),
            quiet_end: z.number().int().min(0).max(1439),
            quiet_enabled: z.boolean(),
          })
          .parse(body);
        await tx.query(
          "UPDATE shops SET threshold=$2,timezone=$3,quiet_start=$4,quiet_end=$5,quiet_enabled=$6 WHERE shop=$1",
          [
            shop,
            v.threshold,
            v.timezone,
            v.quiet_start,
            v.quiet_end,
            v.quiet_enabled,
          ],
        );
        result = { ok: true };
      } else if (
        operation === "inventory-settings" &&
        request.method === "POST"
      ) {
        const v = z
          .object({
            item_id: gid,
            location_id: gid,
            threshold: z.number().int().min(1).max(100000).nullable(),
            enabled: z.boolean(),
          })
          .parse(body);
        const { rows } = await tx.query(
          "UPDATE inventory SET threshold=$4,enabled=$5 WHERE shop=$1 AND item_id=$2 AND location_id=$3 RETURNING item_id",
          [shop, v.item_id, v.location_id, v.threshold, v.enabled],
        );
        if (!rows.length) throw new ApiError(404, "Variant not found");
        result = { ok: true };
      } else if (operation === "ack" && request.method === "POST") {
        const id = z.string().uuid().parse(body.id),
          note = z
            .string()
            .max(1000)
            .parse(body.note ?? "");
        const { rows } = await tx.query(
          "UPDATE alerts SET seen_at=now(),response_note=$3 WHERE shop=$1 AND id=$2 RETURNING id",
          [shop, id, note],
        );
        if (!rows.length) throw new ApiError(404, "Alert not found");
        result = { ok: true };
      } else if (operation === "device" && request.method === "POST") {
        await registerDevice(
          tx,
          uid,
          shop,
          z.string().min(20).max(4096).parse(body.token),
        );
        result = { ok: true };
      } else if (operation === "device" && request.method === "DELETE") {
        await tx.query(
          "DELETE FROM devices WHERE uid=$1 AND shop=$2 AND token_hash=$3",
          [uid, shop, hash(z.string().parse(body.token))],
        );
        result = { ok: true };
      } else if (operation === "disconnect" && request.method === "POST") {
        await tx.query("DELETE FROM devices WHERE uid=$1 AND shop=$2", [
          uid,
          shop,
        ]);
        await tx.query("DELETE FROM members WHERE uid=$1 AND shop=$2", [
          uid,
          shop,
        ]);
        result = { ok: true };
      } else if (operation === "sync" && request.method === "POST") {
        await enqueue(
          tx,
          shop,
          "sync",
          {},
          `manual:${shop}:${Math.floor(Date.now() / 60_000)}`,
        );
        result = { queued: true };
      } else if (operation === "test-push" && request.method === "POST") {
        const id = crypto.randomUUID();
        await tx.query(
          "INSERT INTO alerts(id,shop,kind,title) VALUES($1,$2,'test','StoreControl test notification')",
          [id, shop],
        );
        await enqueue(
          tx,
          shop,
          "push",
          { alertId: id },
          `test:${shop}:${Math.floor(Date.now() / 60_000)}`,
        );
        result = { queued: true };
      } else throw new ApiError(404, "Operation not available");
      return Response.json(result, {
        headers: { "Cache-Control": "no-store" },
      });
    });
  } catch (e) {
    const status =
      e instanceof ApiError ? e.status : e instanceof z.ZodError ? 400 : 500;
    return Response.json(
      {
        error:
          e instanceof ApiError
            ? e.message
            : status === 400
              ? "Invalid request"
              : "Request failed; try again",
      },
      { status, headers: { "Cache-Control": "no-store" } },
    );
  }
}
export const loader = ({ request, params }: LoaderFunctionArgs) =>
  handle(request, params["*"] ?? "");
export const action = ({ request, params }: ActionFunctionArgs) =>
  handle(request, params["*"] ?? "");
