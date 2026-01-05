import type { Routes } from "~/hono/Routes";
import { withBuyerInfoApi } from "./buyer-info";
import { withCollectionApi } from "./collection";
import { withCreateApi } from "./create";
import { withFetchApi } from "./fetch";

export const withTransactionApi: Routes.Fn = async (routes) => {
	await withCollectionApi(routes);
	await withCreateApi(routes);
	await withFetchApi(routes);
	await withBuyerInfoApi(routes);
};
