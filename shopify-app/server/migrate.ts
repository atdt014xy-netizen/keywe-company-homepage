import "dotenv/config";
import { readFile } from "node:fs/promises";
import { db, closeDB } from "./db";
const sql = await readFile(new URL("./schema.sql", import.meta.url), "utf8");
// Each statement is deliberately standalone; works with pg and PGlite.
for (const statement of sql.split(";").filter((s) => s.trim()))
  await db.query(statement);
console.log("StoreControl schema v1 applied");
await closeDB();
