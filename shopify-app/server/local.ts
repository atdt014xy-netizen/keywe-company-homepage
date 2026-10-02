import "dotenv/config";
import express from "express";
import { createRequestHandler } from "@react-router/express";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { readFile } from "node:fs/promises";
import { db, closeDB } from "./db";
import { schedule, workOne } from "./worker";
const sql = await readFile(new URL("./schema.sql", import.meta.url), "utf8");
for (const statement of sql.split(";").filter((s) => s.trim()))
  await db.query(statement);
const build = await import(
  pathToFileURL(resolve("build/server/index.js")).href
);
const app = express();
app.disable("x-powered-by");
app.use(express.static("build/client"));
app.use(createRequestHandler({ build, mode: "development" }));
const server = app.listen(3000, "127.0.0.1");
console.log(
  "StoreControl local server: http://127.0.0.1:3000 (no store connected)",
);
let stop = false;
async function shutdown() {
  if (stop) return;
  stop = true;
  server.close();
  await closeDB();
}
process.on("SIGINT", () => void shutdown());
process.on("SIGTERM", () => void shutdown());
let scheduled = 0;
while (!stop) {
  try {
    if (Date.now() - scheduled > 60000) {
      await schedule();
      scheduled = Date.now();
    }
    if (!(await workOne())) await new Promise((r) => setTimeout(r, 1000));
  } catch {
    console.error("LOCAL_WORKER_ERROR");
    await new Promise((r) => setTimeout(r, 5000));
  }
}
