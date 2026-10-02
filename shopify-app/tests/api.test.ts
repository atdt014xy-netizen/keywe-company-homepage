import { beforeAll, afterAll, expect, it, vi } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { readFile } from "node:fs/promises";
import type { DB } from "../server/db";
import { embeddedDB } from "../server/pglite-adapter";
const state = vi.hoisted(() => ({ db: undefined as DB | undefined }));
vi.mock("../server/db", () => ({
  db: {
    query: (...args: Parameters<DB["query"]>) => state.db!.query(...args),
    transaction: (fn: Parameters<DB["transaction"]>[0]) =>
      state.db!.transaction(fn),
  },
  lockShop: async () => {},
}));
// Only identity verification is replaced. Production verification is smoke-tested to reject unauthenticated requests.
vi.mock("../server/firebase", () => ({ identity: async () => "member-a" }));
import { loader, action } from "../app/routes/api.mobile.$";
let pg: PGlite;
beforeAll(async () => {
  pg = new PGlite();
  await pg.exec(
    await readFile(new URL("../server/schema.sql", import.meta.url), "utf8"),
  );
  state.db = embeddedDB(pg);
  await pg.query(
    "INSERT INTO shops(shop) VALUES('alpha.myshopify.com'),('beta.myshopify.com')",
  );
  await pg.query(
    "INSERT INTO members(uid,shop) VALUES('member-a','alpha.myshopify.com')",
  );
});
afterAll(async () => {
  await pg.close();
});
it("enforces tenant authorization on actual mobile read route", async () => {
  const request = new Request(
    "https://local/api/mobile/overview?shop=beta.myshopify.com",
  );
  const response = await loader({
    request,
    params: { "*": "overview" },
    context: {},
    url: new URL(request.url),
    pattern: "/api/mobile/*",
  } as Parameters<typeof loader>[0]);
  expect(response.status).toBe(403);
});
it("enforces tenant authorization before settings and device writes", async () => {
  for (const route of [
    "settings",
    "device",
    "ack",
    "inventory-settings",
    "disconnect",
  ]) {
    const request = new Request(`https://local/api/mobile/${route}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shop: "beta.myshopify.com" }),
    });
    const response = await action({
      request,
      params: { "*": route },
      context: {},
      url: new URL(request.url),
      pattern: "/api/mobile/*",
    } as Parameters<typeof action>[0]);
    expect(response.status).toBe(403);
  }
  expect(
    (await pg.query("SELECT count(*)::int AS n FROM members")).rows,
  ).toEqual([{ n: 1 }]);
});
it("returns an explicitly live response for an authorized store", async () => {
  const request = new Request(
    "https://local/api/mobile/overview?shop=alpha.myshopify.com",
  );
  const response = await loader({
    request,
    params: { "*": "overview" },
    context: {},
    url: new URL(request.url),
    pattern: "/api/mobile/*",
  } as Parameters<typeof loader>[0]);
  expect(response.status).toBe(200);
  expect(await response.json()).toMatchObject({
    mode: "live",
    inventory: [],
    stale: true,
  });
});
