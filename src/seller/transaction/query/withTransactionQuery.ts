import { withEntityQuery } from "@/lib/client/query";
import { getRootLogger } from "~/common/log/getRootLogger";
import { transactionCollectionFn } from "~/seller/transaction/fn/transactionCollectionFn";
import { transactionCountFn } from "~/seller/transaction/fn/transactionCountFn";
import { transactionFetchFn } from "~/seller/transaction/fn/transactionFetchFn";
import type { TransactionCountQuerySchema } from "~/seller/transaction/server/schema/TransactionCountQuerySchema";
import type { TransactionQuerySchema } from "~/seller/transaction/server/schema/TransactionQuerySchema";
import type { TransactionSchema } from "~/seller/transaction/server/schema/TransactionSchema";

export const withTransactionQuery = withEntityQuery({
	logger: getRootLogger([
		"query",
		"withTransactionQuery",
	]),
	errors: {} as {
		fetch: transactionFetchFn.Error;
		collection: transactionCollectionFn.Error;
		count: transactionCountFn.Error;
		patch: Error;
		create: Error;
		delete: Error;
		patchCollection: Error;
	},
	keys() {
		return [
			"seller",
			"transaction",
		];
	},
	toIdKey(id): TransactionQuerySchema.Type {
		return {
			where: {
				id,
			},
		};
	},
	async fetchFn(data: TransactionQuerySchema.Type) {
		return transactionFetchFn({
			data,
		});
	},
	async collectionFn(data: TransactionQuerySchema.Type) {
		return transactionCollectionFn({
			data,
		});
	},
	async countFn(data: TransactionCountQuerySchema.Type) {
		return transactionCountFn({
			data,
		});
	},
	async createFn(_data: never): Promise<TransactionSchema.Type> {
		throw new Error("Transaction create is not supported.");
	},
	async deleteFn(_data: never): Promise<TransactionSchema.Type> {
		throw new Error("Transaction delete is not supported.");
	},
	async patchFn(_data: never): Promise<TransactionSchema.Type> {
		throw new Error("Transaction patch is not supported.");
	},
	async patchCollectionFn(_data: never): Promise<TransactionSchema.Type[]> {
		throw new Error("Transaction collection patch is not supported.");
	},
});
