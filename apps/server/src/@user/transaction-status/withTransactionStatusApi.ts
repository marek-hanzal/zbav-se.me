import type { Routes } from "~/hono/Routes";
import { withTransactionStatusAcceptApi } from "./transaction-status-accept";
import { withTransactionStatusRejectApi } from "./transaction-status-reject";

export const withTransactionStatusApi: Routes.Fn = (routes) => {
	withTransactionStatusAcceptApi(routes);
	withTransactionStatusRejectApi(routes);
};
