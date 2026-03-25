import { withEntityQuery } from "@use-pico/client/query";
import { isomorphicFn } from "@use-pico/client/utils";
import { withApi } from "@use-pico/common/api";
import {
	apiTransactionCollection,
	apiTransactionCount,
	apiTransactionCreate,
	apiTransactionFetch,
	type tTransaction,
	type tTransactionCountQuery,
	type tTransactionCreate,
	type tTransactionQuery,
} from "../../../api/buyer";

export const withTransactionQuery = withEntityQuery<
	tTransaction,
	tTransactionQuery,
	tTransactionQuery,
	tTransactionCountQuery,
	never,
	tTransactionCreate,
	never,
	never
>({
	keys: () => [
		"transaction",
	],
	toIdKey: (id) => ({
		where: {
			id,
		},
	}),
	fetchFn: isomorphicFn({
		requestFn(request, headers) {
			return withApi(
				apiTransactionFetch({
					body: request,
					headers,
				}),
			);
		},
	}),
	collectionFn: isomorphicFn({
		requestFn(request, headers) {
			return withApi(
				apiTransactionCollection({
					body: request,
					headers,
				}),
			);
		},
	}),
	countFn: isomorphicFn({
		requestFn(request, headers) {
			return withApi(
				apiTransactionCount({
					body: request,
					headers,
				}),
			);
		},
	}),
	createFn: isomorphicFn({
		requestFn(request, headers) {
			return withApi(
				apiTransactionCreate({
					body: request,
					headers,
				}),
			);
		},
	}),
	async deleteFn(_data) {
		throw new Error("Transaction delete is not supported.");
	},
	async patchFn(_data) {
		throw new Error("Transaction patch is not supported.");
	},
	async patchCollectionFn(_data) {
		throw new Error("Transaction collection patch is not supported.");
	},
});
