import { withEntityQuery } from "@use-pico/client/query";
import { transactionCollectionFn } from "~/client/@seller/transaction/server/fn/transactionCollectionFn";
import { transactionCountFn } from "~/client/@seller/transaction/server/fn/transactionCountFn";
import { transactionFetchFn } from "~/client/@seller/transaction/server/fn/transactionFetchFn";
import type { TransactionCountQuerySchema } from "~/client/@seller/transaction/server/schema/TransactionCountQuerySchema";
import type { TransactionQuerySchema } from "~/client/@seller/transaction/server/schema/TransactionQuerySchema";
import type { TransactionSchema } from "~/client/@seller/transaction/server/schema/TransactionSchema";

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
