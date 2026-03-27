import { withEntityQuery } from "@use-pico/client/query";
import { transactionCollectionFn } from "~/server/@seller/transaction/fn/transactionCollectionFn";
import { transactionCountFn } from "~/server/@seller/transaction/fn/transactionCountFn";
import { transactionFetchFn } from "~/server/@seller/transaction/fn/transactionFetchFn";
import type { TransactionCountQuerySchema } from "~/server/@seller/transaction/schema/TransactionCountQuerySchema";
import type { TransactionQuerySchema } from "~/server/@seller/transaction/schema/TransactionQuerySchema";
import type { TransactionSchema } from "~/server/@seller/transaction/schema/TransactionSchema";

export const withTransactionQuery = withEntityQuery<
	TransactionSchema.Type,
	TransactionQuerySchema.Type,
	TransactionQuerySchema.Type,
	TransactionCountQuerySchema.Type,
	never,
	never,
	never,
	never
>({
	keys: () => [
		"seller",
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
	async createFn(_data) {
		throw new Error("Transaction create is not supported.");
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
