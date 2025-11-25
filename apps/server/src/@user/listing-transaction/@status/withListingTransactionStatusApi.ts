import type { Routes } from "../../../hono/Routes";
import { withListingTransactionStatusAcceptApi } from "./listing-transaction-status-accept";
import { withListingTransactionStatusRejectApi } from "./listing-transaction-status-reject";

export const withListingTransactionStatusApi: Routes.Fn = (routes) => {
	withListingTransactionStatusAcceptApi(routes);
	withListingTransactionStatusRejectApi(routes);
};
