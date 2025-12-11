import type { Routes } from "~/hono/Routes";
import { withTransactionBuyerInfoApi } from "./transaction-buyer-info";
import { withTransactionCollectionApi } from "./transaction-collection";
import { withTransactionCreateApi } from "./transaction-create";
import { withTransactionFetchApi } from "./transaction-fetch";
import { withTransactionSellerInfoApi } from "./transaction-seller-info";

export const withTransactionApi: Routes.Fn = (routes) => {
	withTransactionCollectionApi(routes);
	withTransactionCreateApi(routes);
	withTransactionFetchApi(routes);
	withTransactionSellerInfoApi(routes);
	withTransactionBuyerInfoApi(routes);
};
