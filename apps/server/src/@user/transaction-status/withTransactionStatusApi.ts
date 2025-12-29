import type { Routes } from "~/hono/Routes";
import { withAcceptApi } from "./accept";
import { withCloseApi } from "./close";
import { withDisputeApi } from "./dispute";
import { withRejectApi } from "./reject";
import { withResolveApi } from "./resolve";
import { withSuccessApi } from "./success";

export const withTransactionStatusApi: Routes.Fn = (routes) => {
	withAcceptApi(routes);
	withRejectApi(routes);
	withResolveApi(routes);
	withSuccessApi(routes);
	withDisputeApi(routes);
	withCloseApi(routes);
};
