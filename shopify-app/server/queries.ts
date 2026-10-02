export const LOCATIONS = `#graphql
query StoreLocations($after:String) {
  locations(first:100,after:$after) {
    nodes { id name isActive }
    pageInfo { hasNextPage endCursor }
  }
}`;
export const INVENTORY = `#graphql
query StoreInventory($after:String,$location:ID!) {
  inventoryItems(first:100,after:$after) {
    nodes {
      id tracked
      variant { id title image { url } product { id title } }
      inventoryLevel(locationId:$location) {
        updatedAt location { id name }
        quantities(names:["available"]) { name quantity }
      }
    }
    pageInfo { hasNextPage endCursor }
  }
}`;
