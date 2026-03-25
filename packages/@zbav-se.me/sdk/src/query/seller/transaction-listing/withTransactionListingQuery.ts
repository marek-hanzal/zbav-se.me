import { withEntityQuery } from "@use-pico/client/query";
import { isomorphicFn } from "@use-pico/client/utils";
import { withApi } from "@use-pico/common/api";
import {
	apiTransactionListingCollection,
	apiTransactionListingCount,
	apiTransactionListingFetch,
	type tTransactionListing,
	type tTransactionListingCountQuery,
	type tTransactionListingQuery,
} from "../../../api/seller";

export const withTransactionListingQuery = withEntityQuery<
	tTransactionListing,
	tTransactionListingQuery,
	tTransactionListingQuery,
	tTransactionListingCountQuery,
	never,
	never,
	never,
	never
>({
	keys: () => [
		"transaction-listing",
	],
	toIdKey: (id) => ({
		where: {
			id,
		},
	}),
	fetchFn: isomorphicFn({
		requestFn(request, headers) {
			return withApi(
				apiTransactionListingFetch({
					body: request,
					headers,
				}),
			);
		},
	}),
	collectionFn: isomorphicFn({
		requestFn(request, headers) {
			return withApi(
				apiTransactionListingCollection({
					body: request,
					headers,
				}),
			);
		},
	}),
	countFn: isomorphicFn({
		requestFn(request, headers) {
			return withApi(
				apiTransactionListingCount({
					body: request,
					headers,
				}),
			);
		},
	}),
	async createFn(_data) {
		throw new Error("Transaction listing create is not supported.");
	},
	async deleteFn(_data) {
		throw new Error("Transaction listing delete is not supported.");
	},
	async patchFn(_data) {
		throw new Error("Transaction listing patch is not supported.");
	},
	async patchCollectionFn(_data) {
		throw new Error("Transaction listing collection patch is not supported.");
	},
});
