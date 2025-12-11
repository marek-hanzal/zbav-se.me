import type { Routes } from "~/hono/Routes";
import { withListingTransactionLogCollectionApi } from "./listing-transaction-log-collection";

export const withListingTransactionLogApi: Routes.Fn = (routes) => {
	withListingTransactionLogCollectionApi(routes);
};
