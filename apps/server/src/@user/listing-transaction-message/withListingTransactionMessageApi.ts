import type { Routes } from "~/hono/Routes";
import { withListingTransactionMessageCreateApi } from "./listing-transaction-message-create";

export const withListingTransactionMessageApi: Routes.Fn = (routes) => {
	withListingTransactionMessageCreateApi(routes);
};
