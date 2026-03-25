import { withEntityQuery } from "@use-pico/client/query";
import { isomorphicFn } from "@use-pico/client/utils";
import { withApi } from "@use-pico/common/api";
import {
	apiTransactionCollection,
	apiTransactionCount,
	apiTransactionFetch,
	type tTransaction,
	type tTransactionCountQuery,
	type tTransactionQuery,
} from "../../../api/seller";

export const withTransactionQuery = withEntityQuery<
	tTransaction,
	tTransactionQuery,
	tTransactionQuery,
	tTransactionCountQuery,
	never,
	never,
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
	async createFn(_data) {
		throw new Error("Transaction create is not supported.");
	},
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
