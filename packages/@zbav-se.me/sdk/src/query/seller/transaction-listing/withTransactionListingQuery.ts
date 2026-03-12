import { withEntityQuery } from "@use-pico/client/query";
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
	async fetchFn(data) {
		return withApi(
			apiTransactionListingFetch({
				body: data,
			}),
		);
	},
	async collectionFn(data) {
		return withApi(
			apiTransactionListingCollection({
				body: data,
			}),
		);
	},
	async countFn(data) {
		return withApi(
			apiTransactionListingCount({
				body: data,
			}),
		);
	},
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
