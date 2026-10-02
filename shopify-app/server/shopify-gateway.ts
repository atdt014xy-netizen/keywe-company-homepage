import { unauthenticated } from "../app/shopify.server";
import { INVENTORY, LOCATIONS } from "./queries";
import type { Snapshot } from "./store";
interface GraphResponse<T> {
  data?: T;
  errors?: { extensions?: { code?: string } }[];
  extensions?: {
    cost?: {
      throttleStatus?: { currentlyAvailable: number; restoreRate: number };
    };
  };
}
interface Connection<T> {
  nodes: T[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}
interface Location {
  id: string;
  name: string;
  isActive: boolean;
}
interface InventoryNode {
  id: string;
  tracked: boolean;
  variant: null | {
    id: string;
    title: string;
    image: null | { url: string };
    product: { id: string; title: string };
  };
  inventoryLevel: null | {
    updatedAt: string;
    location: Location;
    quantities: { name: string; quantity: number }[];
  };
}
export async function graphql<T>(
  shop: string,
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  const { admin } = await unauthenticated.admin(shop);
  const response = await admin.graphql(query, { variables });
  const body = (await response.json()) as unknown as GraphResponse<T>;
  if (!response.ok || body.errors?.length || !body.data) {
    const throttled =
      response.status === 429 ||
      body.errors?.some((e) => e.extensions?.code === "THROTTLED");
    throw new Error(throttled ? "SHOPIFY_THROTTLED" : "SHOPIFY_REQUEST_FAILED");
  }
  const cost = body.extensions?.cost?.throttleStatus;
  if (cost && cost.currentlyAvailable < 100 && cost.restoreRate > 0) {
    await new Promise((r) =>
      setTimeout(
        r,
        Math.min(
          5000,
          Math.ceil((100 - cost.currentlyAvailable) / cost.restoreRate) * 1000,
        ),
      ),
    );
  }
  return body.data;
}
export async function locations(shop: string): Promise<Location[]> {
  const all: Location[] = [];
  let after: string | null = null;
  do {
    const data: { locations: Connection<Location> } = await graphql<{
      locations: Connection<Location>;
    }>(shop, LOCATIONS, { after });
    all.push(...data.locations.nodes.filter((n) => n.isActive));
    if (!data.locations.pageInfo.hasNextPage) break;
    after = data.locations.pageInfo.endCursor;
  } while (after);
  return all;
}
export async function* snapshots(
  shop: string,
  location: string,
): AsyncGenerator<Snapshot[]> {
  let after: string | null = null;
  do {
    const data: { inventoryItems: Connection<InventoryNode> } = await graphql<{
      inventoryItems: Connection<InventoryNode>;
    }>(shop, INVENTORY, { after, location });
    yield data.inventoryItems.nodes.flatMap((n) => {
      if (!n.variant || !n.inventoryLevel) return [];
      const v = n.variant,
        level = n.inventoryLevel;
      return [
        {
          item_id: n.id,
          location_id: location,
          product_id: v.product.id,
          variant_id: v.id,
          title: v.product.title,
          variant: v.title,
          location_name: level.location.name,
          image: v.image?.url ?? null,
          tracked: n.tracked,
          available: n.tracked
            ? (level.quantities.find((q) => q.name === "available")?.quantity ??
              null)
            : null,
          source_at: new Date(level.updatedAt),
        },
      ];
    });
    if (!data.inventoryItems.pageInfo.hasNextPage) break;
    after = data.inventoryItems.pageInfo.endCursor;
  } while (after);
}
