import type { Routes } from "~/hono/Routes";
import { withBuyerInfoApi } from "./buyer-info";
import { withCollectionApi } from "./collection";
import { withCreateApi } from "./create";
import { withFetchApi } from "./fetch";

export const withTransactionApi: Routes.Fn = (routes) => {
	withCollectionApi(routes);
	withCreateApi(routes);
	withFetchApi(routes);
	withBuyerInfoApi(routes);
};
