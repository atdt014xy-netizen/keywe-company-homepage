import pg from "pg";
import type { PGlite } from "@electric-sql/pglite";
import { embeddedDB } from "./pglite-adapter";
export interface DB {
  query<T extends Record<string, unknown> = pg.QueryResultRow>(
    sql: string,
    params?: unknown[],
  ): Promise<{ rows: T[]; rowCount?: number | null }>;
  transaction<T>(fn: (db: DB) => Promise<T>): Promise<T>;
}
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
});
function wrap(client: pg.Pool | pg.PoolClient): DB {
  return {
    async query(sql, params) {
      return client.query(sql, params);
    },
    async transaction(fn) {
      const c =
        "connect" in client
          ? await (client as pg.Pool).connect()
          : (client as pg.PoolClient);
      await c.query("BEGIN");
      try {
        const value = await fn(wrap(c));
        await c.query("COMMIT");
        return value;
      } catch (e) {
        await c.query("ROLLBACK");
        throw e;
      } finally {
        if (c !== client) c.release();
      }
    },
  };
}
// Embedded PostgreSQL is a single-process fallback for local development only.
// Production and the separate worker always use the PostgreSQL server above.
let embedded: PGlite | undefined;
if (process.env.LOCAL_DATABASE_DIR) {
  if (process.env.NODE_ENV === "production")
    throw new Error("Embedded database is development-only");
  const { PGlite } = await import("@electric-sql/pglite");
  const shared = globalThis as typeof globalThis & {
    storecontrolLocalPg?: PGlite;
  };
  embedded = shared.storecontrolLocalPg ??= new PGlite(
    process.env.LOCAL_DATABASE_DIR,
  );
}
export const db: DB = embedded ? embeddedDB(embedded) : wrap(pool);
export const closeDB = async () => {
  if (embedded) await embedded.close();
  await pool.end();
};
export async function lockShop(db: DB, shop: string) {
  // Serialize inventory snapshots, linking, uninstall, and writes for one tenant.
  await db.query("SELECT shop FROM shops WHERE shop=$1 FOR UPDATE", [shop]);
}
