import { withEntityQuery } from "@/lib/client/query";
import { getRootLogger } from "~/common/log/getRootLogger";
import { transactionEntryCollectionFn } from "~/user/transaction-entry/fn/transactionEntryCollectionFn";
import { transactionEntryCountFn } from "~/user/transaction-entry/fn/transactionEntryCountFn";
import { transactionEntryCreateFn } from "~/user/transaction-entry/fn/transactionEntryCreateFn";
import { transactionEntryFetchFn } from "~/user/transaction-entry/fn/transactionEntryFetchFn";
import type { TransactionEntryCountQuerySchema } from "~/user/transaction-entry/server/schema/TransactionEntryCountQuerySchema";
import type { TransactionEntryCreateSchema } from "~/user/transaction-entry/server/schema/TransactionEntryCreateSchema";
import type { TransactionEntryQuerySchema } from "~/user/transaction-entry/server/schema/TransactionEntryQuerySchema";
import type { TransactionEntrySchema } from "~/user/transaction-entry/server/schema/TransactionEntrySchema";

export const withTransactionEntryQuery = withEntityQuery({
	logger: getRootLogger([
		"query",
		"withTransactionEntryQuery",
	]),
	errors: {} as {
		fetch: transactionEntryFetchFn.Error;
		collection: transactionEntryCollectionFn.Error;
		count: transactionEntryCountFn.Error;
		patch: Error;
		create: transactionEntryCreateFn.Error;
		delete: Error;
		patchCollection: Error;
	},
	keys() {
		return [
			"transaction-entry",
		];
	},
	toIdKey(id): TransactionEntryQuerySchema.Type {
		return {
			where: {
				id,
			},
		};
	},
	async fetchFn(data: TransactionEntryQuerySchema.Type) {
		return transactionEntryFetchFn({
			data,
		});
	},
	async collectionFn(data: TransactionEntryQuerySchema.Type) {
		return transactionEntryCollectionFn({
			data,
		});
	},
	async countFn(data: TransactionEntryCountQuerySchema.Type) {
		return transactionEntryCountFn({
			data,
		});
	},
	async createFn(data: TransactionEntryCreateSchema.Type) {
		return transactionEntryCreateFn({
			data,
		});
	},
	async patchFn(_data: never): Promise<TransactionEntrySchema.Type> {
		throw new Error("Transaction entry patch is not supported.");
	},
	async patchCollectionFn(_data: never): Promise<TransactionEntrySchema.Type[]> {
		throw new Error("Transaction entry collection patch is not supported.");
	},
	async deleteFn(_data: never): Promise<TransactionEntrySchema.Type> {
		throw new Error("Transaction entry delete is not supported.");
	},
});
