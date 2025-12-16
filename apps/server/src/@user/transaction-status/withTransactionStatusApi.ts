import type { Routes } from "~/hono/Routes";
import { withAcceptApi } from "./accept";
import { withRejectApi } from "./reject";

export const withTransactionStatusApi: Routes.Fn = (routes) => {
	withAcceptApi(routes);
	withRejectApi(routes);
};
