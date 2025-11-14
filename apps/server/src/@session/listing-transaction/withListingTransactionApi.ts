import type { Routes } from "../../hono/Routes";
import { withListingTransactionCollectionApi } from "./listing-transaction-collection";
import { withListingTransactionCreateApi } from "./listing-transaction-create";

export const withListingTransactionApi: Routes.Fn = (routes) => {
	withListingTransactionCollectionApi(routes);
	withListingTransactionCreateApi(routes);
};
