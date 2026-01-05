import type { Routes } from "~/hono/Routes";
import { withAcceptApi } from "./accept";
import { withCloseApi } from "./close";
import { withDisputeApi } from "./dispute";
import { withRejectApi } from "./reject";
import { withResolveApi } from "./resolve";
import { withSuccessApi } from "./success";

export const withTransactionStatusApi: Routes.Fn = async (routes) => {
	await withAcceptApi(routes);
	await withRejectApi(routes);
	await withResolveApi(routes);
	await withSuccessApi(routes);
	await withDisputeApi(routes);
	await withCloseApi(routes);
};
