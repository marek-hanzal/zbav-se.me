import { withEntityQuery } from "@/lib/client/query";
import { getRootLogger } from "~/common/log/getRootLogger";
import { transactionListingCollectionFn } from "~/seller/transaction-listing/fn/transactionListingCollectionFn";
import { transactionListingCountFn } from "~/seller/transaction-listing/fn/transactionListingCountFn";
import { transactionListingFetchFn } from "~/seller/transaction-listing/fn/transactionListingFetchFn";
import type { TransactionListingCountQuerySchema } from "~/seller/transaction-listing/server/schema/TransactionListingCountQuerySchema";
import type { TransactionListingQuerySchema } from "~/seller/transaction-listing/server/schema/TransactionListingQuerySchema";
import type { TransactionListingSchema } from "~/seller/transaction-listing/server/schema/TransactionListingSchema";

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
	logger: getRootLogger([
		"query",
		"withTransactionListingQuery",
	]),
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
