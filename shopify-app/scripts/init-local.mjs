import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
await mkdir("../.local", { recursive: true });
const values =
  [
    "NODE_ENV=development",
    `LOCAL_DATABASE_DIR=${resolve("../.local/postgres").replaceAll("\\", "/")}`,
    "SHOPIFY_API_KEY=local-unconfigured",
    `SHOPIFY_API_SECRET=${randomBytes(32).toString("hex")}`,
    `TOKEN_ENCRYPTION_KEY=${randomBytes(32).toString("base64")}`,
    "SHOPIFY_APP_URL=http://127.0.0.1:3000",
    "SCOPES=read_products,read_inventory,read_locations",
    "ENABLE_DISCOUNTS=false",
    "ALLOW_DEVELOPMENT_TRIAL=false",
  ].join("\n") + "\n";
try {
  await writeFile(".env.local", values, { flag: "wx" });
  console.log(
    "Created .env.local with local-only random keys; no external accounts connected.",
  );
} catch (e) {
  if (e.code === "EEXIST") console.log("Existing .env.local preserved.");
  else throw e;
}
