import type { Routes } from "~/hono/Routes";
import { withTransactionBuyerInfoApi } from "./buyer-info";
import { withTransactionCollectionApi } from "./collection";
import { withTransactionCreateApi } from "./create";
import { withTransactionFetchApi } from "./fetch";
import { withTransactionSellerInfoApi } from "./seller-info";

export const withTransactionApi: Routes.Fn = (routes) => {
	withTransactionCollectionApi(routes);
	withTransactionCreateApi(routes);
	withTransactionFetchApi(routes);
	withTransactionSellerInfoApi(routes);
	withTransactionBuyerInfoApi(routes);
};
