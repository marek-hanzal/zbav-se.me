import type { Routes } from "~/hono/Routes";
import { withTransactionLogCollectionApi } from "./transaction-log-collection";

export const withTransactionLogApi: Routes.Fn = (routes) => {
	withTransactionLogCollectionApi(routes);
};
