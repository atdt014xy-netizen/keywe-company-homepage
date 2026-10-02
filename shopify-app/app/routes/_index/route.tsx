import type { LoaderFunctionArgs } from "react-router";
import { redirect, Form, useLoaderData } from "react-router";

import { login } from "../../shopify.server";

import styles from "./styles.module.css";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }

  return { showForm: Boolean(login) };
};

export default function App() {
  const { showForm } = useLoaderData<typeof loader>();

  return (
    <div className={styles.index}>
      <div className={styles.content}>
        <h1 className={styles.heading}>StoreControl</h1>
        <p className={styles.text}>
          Know when inventory needs your attention. Connect your development
          store to the Android companion app.
        </p>
        {showForm && (
          <Form className={styles.form} method="post" action="/auth/login">
            <label className={styles.label}>
              <span>Shop domain</span>
              <input className={styles.input} type="text" name="shop" />
              <span>e.g: my-shop-domain.myshopify.com</span>
            </label>
            <button className={styles.button} type="submit">
              Log in
            </button>
          </Form>
        )}
        <ul className={styles.list}>
          <li>
            <strong>Location-aware inventory</strong>. Monitor available stock
            for each variant at your selected warehouse.
          </li>
          <li>
            <strong>Useful alerts</strong>. Low-stock and out-of-stock
            notifications with a durable inbox.
          </li>
          <li>
            <strong>Development preview</strong>. No paid plan or live inventory
            connection is implied by this page. Installation approval is
            required.
          </li>
        </ul>
      </div>
    </div>
  );
}
