import { withEntityQuery } from "@use-pico/client/query";
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
	async createFn(data) {
		return withApi(
			apiTransactionCreate({
				body: data,
			}),
		);
	},
	async deleteFn(_data) {
		throw new Error("Transaction delete is not supported.");
	},
	async patchFn(_data) {
		throw new Error("Transaction patch is not supported.");
	},
});
