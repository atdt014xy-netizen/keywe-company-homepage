import type { PGlite, Transaction } from "@electric-sql/pglite";
import type { DB } from "./db";
export function embeddedDB(client: PGlite | Transaction): DB {
  return {
    query: (sql, params) => client.query(sql, params),
    transaction: (fn) =>
      "transaction" in client
        ? client.transaction((tx) => fn(embeddedDB(tx)))
        : fn(embeddedDB(client)),
  };
}
