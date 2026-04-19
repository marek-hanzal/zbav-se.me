import { withEntityQuery } from "@/lib/client/query";
import { transactionCollectionFn } from "~/buyer/transaction/fn/transactionCollectionFn";
import { transactionCountFn } from "~/buyer/transaction/fn/transactionCountFn";
import { transactionCreateFn } from "~/buyer/transaction/fn/transactionCreateFn";
import { transactionFetchFn } from "~/buyer/transaction/fn/transactionFetchFn";
import type { TransactionCountQuerySchema } from "~/buyer/transaction/server/schema/TransactionCountQuerySchema";
import type { TransactionCreateSchema } from "~/buyer/transaction/server/schema/TransactionCreateSchema";
import type { TransactionQuerySchema } from "~/buyer/transaction/server/schema/TransactionQuerySchema";
import type { TransactionSchema } from "~/buyer/transaction/server/schema/TransactionSchema";
import { getRootLogger } from "~/common/log/getRootLogger";

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
		create: transactionCreateFn.Error;
		delete: Error;
		patchCollection: Error;
	},
	keys() {
		return [
			"buyer",
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
	async createFn(data: TransactionCreateSchema.Type) {
		return transactionCreateFn({
			data,
		});
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
