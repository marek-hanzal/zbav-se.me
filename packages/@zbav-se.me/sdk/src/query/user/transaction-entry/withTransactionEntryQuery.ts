import { withEntityQuery } from "@use-pico/client/query";
import { isomorphicFn } from "@use-pico/client/utils";
import { withApi } from "@use-pico/common/api";
import {
	apiTransactionEntryCollection,
	apiTransactionEntryCount,
	apiTransactionEntryCreate,
	apiTransactionEntryFetch,
	type tTransactionEntry,
	type tTransactionEntryCountQuery,
	type tTransactionEntryCreate,
	type tTransactionEntryQuery,
} from "../../../api/user";

export const withTransactionEntryQuery = withEntityQuery<
	tTransactionEntry,
	tTransactionEntryQuery,
	tTransactionEntryQuery,
	tTransactionEntryCountQuery,
	never,
	tTransactionEntryCreate,
	never,
	never
>({
	keys: () => [
		"transaction-entry",
	],
	toIdKey: (id) => ({
		where: {
			id,
		},
	}),
	fetchFn: isomorphicFn({
		requestFn(request, headers) {
			return withApi(
				apiTransactionEntryFetch({
					body: request,
					headers,
				}),
			);
		},
	}),
	collectionFn: isomorphicFn({
		requestFn(request, headers) {
			return withApi(
				apiTransactionEntryCollection({
					body: request,
					headers,
				}),
			);
		},
	}),
	countFn: isomorphicFn({
		requestFn(request, headers) {
			return withApi(
				apiTransactionEntryCount({
					body: request,
					headers,
				}),
			);
		},
	}),
	createFn: isomorphicFn({
		requestFn(request, headers) {
			return withApi(
				apiTransactionEntryCreate({
					body: request,
					headers,
				}),
			);
		},
	}),
	async patchFn(_data) {
		throw new Error("Transaction entry patch is not supported.");
	},
	async patchCollectionFn(_data) {
		throw new Error("Transaction entry collection patch is not supported.");
	},
	async deleteFn(_data) {
		throw new Error("Transaction entry delete is not supported.");
	},
});
