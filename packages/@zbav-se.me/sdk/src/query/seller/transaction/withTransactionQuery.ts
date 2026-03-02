import { withEntityQuery } from "@use-pico/client/query";
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
	async fetchFn(data) {
		return withApi(
			apiTransactionFetch({
				body: data,
			}),
		);
	},
	async collectionFn(data) {
		return withApi(
			apiTransactionCollection({
				body: data,
			}),
		);
	},
	async countFn(data) {
		return withApi(
			apiTransactionCount({
				body: data,
			}),
		);
	},
	async createFn(_data) {
		throw new Error("Transaction create is not supported.");
	},
	async deleteFn(_data) {
		throw new Error("Transaction delete is not supported.");
	},
	async patchFn(_data) {
		throw new Error("Transaction patch is not supported.");
	},
});
