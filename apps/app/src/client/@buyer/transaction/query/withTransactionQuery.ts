import { withEntityQuery } from "@use-pico/client/query";
import { transactionCollectionFn } from "~/server/@buyer/transaction/fn/transactionCollectionFn";
import { transactionCountFn } from "~/server/@buyer/transaction/fn/transactionCountFn";
import { transactionCreateFn } from "~/server/@buyer/transaction/fn/transactionCreateFn";
import { transactionFetchFn } from "~/server/@buyer/transaction/fn/transactionFetchFn";
import type { TransactionCountQuerySchema } from "~/server/@buyer/transaction/schema/TransactionCountQuerySchema";
import type { TransactionCreateSchema } from "~/server/@buyer/transaction/schema/TransactionCreateSchema";
import type { TransactionQuerySchema } from "~/server/@buyer/transaction/schema/TransactionQuerySchema";
import type { TransactionSchema } from "~/server/@buyer/transaction/schema/TransactionSchema";

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
