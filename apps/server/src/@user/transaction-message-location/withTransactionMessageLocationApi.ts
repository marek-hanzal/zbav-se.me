import type { Routes } from "~/hono/Routes";
import { withCreateApi } from "./create";

export const withTransactionMessageLocationApi: Routes.Fn = async (routes) => {
	await withCreateApi(routes);
};
