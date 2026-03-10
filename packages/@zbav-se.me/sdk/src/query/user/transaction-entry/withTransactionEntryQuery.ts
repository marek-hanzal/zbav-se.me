import { withEntityQuery } from "@use-pico/client/query";
import { withApi } from "@use-pico/common/api";
import {
	apiTransactionEntryCollection,
	apiTransactionEntryCount,
	apiTransactionEntryCreate,
	apiTransactionEntryFetch,
	type tApiTransactionEntryCollectionResponse,
	type tTransactionEntryCountQuery,
	type tTransactionEntryCreate,
	type tTransactionEntryQuery,
	type tApiTransactionEntryCreateResponse,
	type tApiTransactionEntryFetchResponse,
} from "../../../api/user";

export namespace withTransactionEntryQuery {
	export type Entity = tApiTransactionEntryFetchResponse[200];
	export type Collection = tApiTransactionEntryCollectionResponse[200];
	export type Create = tApiTransactionEntryCreateResponse[201];
}

export const withTransactionEntryQuery = withEntityQuery<
	withTransactionEntryQuery.Entity,
	tTransactionEntryQuery,
	tTransactionEntryQuery,
	tTransactionEntryCountQuery,
	never,
	tTransactionEntryCreate,
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
	async fetchFn(data) {
		return withApi(
			apiTransactionEntryFetch({
				body: data,
			}),
		);
	},
	async collectionFn(data) {
		return withApi(
			apiTransactionEntryCollection({
				body: data,
			}),
		);
	},
	async countFn(data) {
		return withApi(
			apiTransactionEntryCount({
				body: data,
			}),
		);
	},
	async createFn(data) {
		return withApi(
			apiTransactionEntryCreate({
				body: data,
			}),
		);
	},
	async patchFn(_data) {
		throw new Error("Transaction entry patch is not supported.");
	},
	async deleteFn(_data) {
		throw new Error("Transaction entry delete is not supported.");
	},
});
