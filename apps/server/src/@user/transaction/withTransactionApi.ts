import type { Routes } from "~/hono/Routes";
import { withBuyerInfoApi } from "./buyer-info";
import { withCollectionApi } from "./collection";
import { withCreateApi } from "./create";
import { withFetchApi } from "./fetch";
import { withSellerInfoApi } from "./seller-info";

export const withTransactionApi: Routes.Fn = (routes) => {
	withCollectionApi(routes);
	withCreateApi(routes);
	withFetchApi(routes);
	withSellerInfoApi(routes);
	withBuyerInfoApi(routes);
};
