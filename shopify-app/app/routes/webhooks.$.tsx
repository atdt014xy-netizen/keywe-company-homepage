import type { ActionFunctionArgs } from "react-router";
import { db } from "../../server/db";
import { acceptWebhook } from "../../server/store";
import { shopDomain, validWebhook } from "../../server/security";
const allowed = new Set([
  "app/uninstalled",
  "app/scopes_update",
  "inventory_levels/update",
  "inventory_items/update",
  "products/update",
  "customers/data_request",
  "customers/redact",
  "shop/redact",
]);
export async function action({ request }: ActionFunctionArgs) {
  const raw = Buffer.from(await request.arrayBuffer());
  if (raw.length > 2_000_000) return new Response(null, { status: 413 });
  if (
    !validWebhook(
      raw,
      request.headers.get("x-shopify-hmac-sha256") ?? "",
      process.env.SHOPIFY_API_SECRET ?? "",
    )
  )
    return new Response(null, { status: 401 });
  try {
    const shop = shopDomain(request.headers.get("x-shopify-shop-domain") ?? "");
    const topic = request.headers.get("x-shopify-topic") ?? "";
    const id =
      request.headers.get("x-shopify-event-id") ??
      request.headers.get("x-shopify-webhook-id");
    if (!id || !allowed.has(topic)) return new Response(null, { status: 400 });
    await acceptWebhook(db, shop, id, topic, JSON.parse(raw.toString("utf8")));
    return new Response(null, { status: 200 });
  } catch {
    return new Response(null, { status: 503 });
  }
}
