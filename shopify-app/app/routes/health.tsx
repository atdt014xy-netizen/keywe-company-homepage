import { db } from "../../server/db";
export async function loader() {
  try {
    await db.query("SELECT 1");
    return Response.json({
      status: "ok",
      service: "StoreControl",
      data: "live-api",
      shopifyConnected: "not-asserted",
    });
  } catch {
    return Response.json({ status: "database_unavailable" }, { status: 503 });
  }
}
