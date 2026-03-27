import { withEntityQuery } from "@use-pico/client/query";
import { transactionListingCollectionFn } from "~/server/@seller/transaction-listing/fn/transactionListingCollectionFn";
import { transactionListingCountFn } from "~/server/@seller/transaction-listing/fn/transactionListingCountFn";
import { transactionListingFetchFn } from "~/server/@seller/transaction-listing/fn/transactionListingFetchFn";
import type { TransactionListingCountQuerySchema } from "~/server/@seller/transaction-listing/schema/TransactionListingCountQuerySchema";
import type { TransactionListingQuerySchema } from "~/server/@seller/transaction-listing/schema/TransactionListingQuerySchema";
import type { TransactionListingSchema } from "~/server/@seller/transaction-listing/schema/TransactionListingSchema";

export const withTransactionListingQuery = withEntityQuery<
	TransactionListingSchema.Type,
	TransactionListingQuerySchema.Type,
	TransactionListingQuerySchema.Type,
	TransactionListingCountQuerySchema.Type,
	never,
	never,
	never,
	never
>({
	keys: () => [
		"seller",
		"transaction-listing",
	],
	toIdKey: (id) => ({
		where: {
			id,
		},
	}),
	async fetchFn(data) {
		return transactionListingFetchFn({
			data,
		});
	},
	async collectionFn(data) {
		return transactionListingCollectionFn({
			data,
		});
	},
	async countFn(data) {
		return transactionListingCountFn({
			data,
		});
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
