import { Form, useActionData, useLoaderData } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import { db, lockShop } from "../../server/db";
import { enqueue, issueLink } from "../../server/store";
import { locations } from "../../server/shopify-gateway";
export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const {
    rows: [store],
  } = await db.query("SELECT * FROM shops WHERE shop=$1", [session.shop]);
  let warehouses: { id: string; name: string }[] = [];
  let error: string | null = null;
  try {
    warehouses = await locations(session.shop);
  } catch {
    error = "Unable to load locations. Check granted scopes and reconnect.";
  }
  return { store, warehouses, error };
}
export async function action({ request }: ActionFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const form = await request.formData();
  try {
    if (form.get("intent") === "link") {
      const code = await issueLink(
        db,
        session.shop,
        String(form.get("uid") ?? ""),
      );
      return {
        code,
        message:
          "One use · expires in 5 minutes · only for the mobile account entered above",
      };
    }
    const id = String(form.get("location"));
    const valid = await locations(session.shop);
    const selected = valid.find((x) => x.id === id);
    if (!selected)
      return {
        code: null,
        message: "Select an active location in this store.",
      };
    await db.transaction(async (tx) => {
      await lockShop(tx, session.shop);
      await tx.query(
        "UPDATE shops SET selected_location=$2,location_name=$3,initial_complete=false,synced_at=NULL WHERE shop=$1",
        [session.shop, id, selected.name],
      );
      await enqueue(tx, session.shop, "sync");
    });
    return {
      code: null,
      message: "Location saved. Initial inventory sync queued.",
    };
  } catch {
    return {
      code: null,
      message:
        "Could not complete the request. Check the account ID and connection.",
    };
  }
}
export default function Home() {
  const { store, warehouses, error } = useLoaderData<typeof loader>();
  const result = useActionData<typeof action>();
  return (
    <main
      style={{
        maxWidth: 780,
        margin: "32px auto",
        padding: 24,
        fontFamily: "system-ui",
        color: "#14243b",
      }}
    >
      <h1>StoreControl</h1>
      <p>
        <strong>LIVE STORE</strong> · {store.shop}
      </p>
      <p>
        Inventory alerts for one selected location. Development trial · billing
        is not enabled.
      </p>
      <h2>1. Choose a location</h2>
      <p>Locations are never added together.</p>
      {error && <p role="alert">{error}</p>}
      <Form method="post">
        <input type="hidden" name="intent" value="location" />
        <label>
          Warehouse{" "}
          <select
            name="location"
            defaultValue={store.selected_location ?? ""}
            required
          >
            <option value="">Select location</option>
            {warehouses.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">Save and sync</button>
      </Form>
      <p>
        Last sync:{" "}
        {store.synced_at
          ? new Date(store.synced_at).toISOString()
          : "Not synced"}{" "}
        · {store.sync_error ?? "No reported error"}
      </p>
      <h2>2. Connect your Android account</h2>
      <p>
        Sign in and verify your email in the mobile app. Copy its account ID
        below. The code cannot be redeemed by another account or store.
      </p>
      <Form method="post">
        <input type="hidden" name="intent" value="link" />
        <label>
          Mobile account ID{" "}
          <input name="uid" required maxLength={128} autoComplete="off" />
        </label>
        <button type="submit">Generate connection code</button>
      </Form>
      {result && (
        <section aria-live="polite">
          <p>{result.message}</p>
          {result.code && (
            <p>
              <code style={{ fontSize: 20, userSelect: "all" }}>
                {result.code}
              </code>
            </p>
          )}
        </section>
      )}
      <h2>Development status</h2>
      <p>
        Discounts, storefront banners and paid subscriptions remain disabled
        until the inventory and physical-device checks pass.
      </p>
    </main>
  );
}
