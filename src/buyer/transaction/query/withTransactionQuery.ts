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

export const withTransactionQuery = withEntityQuery<
	TransactionSchema.Type,
	TransactionQuerySchema.Type,
	TransactionQuerySchema.Type,
	TransactionCountQuerySchema.Type,
	never,
	TransactionCreateSchema.Type,
	never,
	never
>({
	logger: getRootLogger([
		"query",
		"withTransactionQuery",
	]),
	keys: () => [
		"buyer",
		"transaction",
	],
	toIdKey: (id) => ({
		where: {
			id,
		},
	}),
	async fetchFn(data) {
		return transactionFetchFn({
			data,
		});
	},
	async collectionFn(data) {
		return transactionCollectionFn({
			data,
		});
	},
	async countFn(data) {
		return transactionCountFn({
			data,
		});
	},
	async createFn(data) {
		return transactionCreateFn({
			data,
		});
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
