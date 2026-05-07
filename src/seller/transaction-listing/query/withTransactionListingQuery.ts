import { withEntityQuery } from "@/lib/client/query";
import { getRootLogger } from "~/common/log/getRootLogger";
import { transactionListingCollectionFn } from "~/seller/transaction-listing/fn/transactionListingCollectionFn";
import { transactionListingCountFn } from "~/seller/transaction-listing/fn/transactionListingCountFn";
import { transactionListingFetchFn } from "~/seller/transaction-listing/fn/transactionListingFetchFn";
import type { TransactionListingCountQuerySchema } from "~/seller/transaction-listing/server/schema/TransactionListingCountQuerySchema";
import type { TransactionListingQuerySchema } from "~/seller/transaction-listing/server/schema/TransactionListingQuerySchema";
import type { TransactionListingSchema } from "~/seller/transaction-listing/server/schema/TransactionListingSchema";

export const withTransactionListingQuery = withEntityQuery({
	logger: getRootLogger([
		"query",
		"withTransactionListingQuery",
	]),
	errors: {} as {
		fetch: transactionListingFetchFn.Error;
		collection: transactionListingCollectionFn.Error;
		count: transactionListingCountFn.Error;
		patch: Error;
		create: Error;
		delete: Error;
		patchCollection: Error;
	},
	keys() {
		return [
			"seller",
			"transaction-listing",
		];
	},
	toIdKey(id): TransactionListingQuerySchema.Type {
		return {
			where: {
				id,
			},
		};
	},
	async fetchFn(data: TransactionListingQuerySchema.Type) {
		return transactionListingFetchFn({
			data,
		});
	},
	async collectionFn(data: TransactionListingQuerySchema.Type) {
		return transactionListingCollectionFn({
			data,
		});
	},
	async countFn(data: TransactionListingCountQuerySchema.Type) {
		return transactionListingCountFn({
			data,
		});
	},
	async createFn(_data: never): Promise<TransactionListingSchema.Type> {
		throw new Error("Transaction listing create is not supported.");
	},
	async deleteFn(_data: never): Promise<TransactionListingSchema.Type> {
		throw new Error("Transaction listing delete is not supported.");
	},
	async patchFn(_data: never): Promise<TransactionListingSchema.Type> {
		throw new Error("Transaction listing patch is not supported.");
	},
	async patchCollectionFn(_data: never): Promise<TransactionListingSchema.Type[]> {
		throw new Error("Transaction listing collection patch is not supported.");
	},
});
