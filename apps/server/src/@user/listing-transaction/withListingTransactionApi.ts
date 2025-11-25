import type { Routes } from "../../hono/Routes";
import { withListingTransactionStatusApi } from "./@status/withListingTransactionStatusApi";
import { withListingTransactionBuyerInfoApi } from "./listing-transaction-buyer-info";
import { withListingTransactionCollectionApi } from "./listing-transaction-collection";
import { withListingTransactionCreateApi } from "./listing-transaction-create";
import { withListingTransactionFetchApi } from "./listing-transaction-fetch";
import { withListingTransactionPatchApi } from "./listing-transaction-patch";
import { withListingTransactionSellerInfoApi } from "./listing-transaction-seller-info";

export const withListingTransactionApi: Routes.Fn = (routes) => {
	withListingTransactionCollectionApi(routes);
	withListingTransactionCreateApi(routes);
	withListingTransactionFetchApi(routes);
	withListingTransactionPatchApi(routes);
	withListingTransactionSellerInfoApi(routes);
	withListingTransactionBuyerInfoApi(routes);
	withListingTransactionStatusApi(routes);
};
