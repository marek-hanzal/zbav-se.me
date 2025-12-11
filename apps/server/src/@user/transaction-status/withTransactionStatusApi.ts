import type { Routes } from "~/hono/Routes";
import { withTransactionStatusAcceptApi } from "./accept";
import { withTransactionStatusRejectApi } from "./reject";

export const withTransactionStatusApi: Routes.Fn = (routes) => {
	withTransactionStatusAcceptApi(routes);
	withTransactionStatusRejectApi(routes);
};
