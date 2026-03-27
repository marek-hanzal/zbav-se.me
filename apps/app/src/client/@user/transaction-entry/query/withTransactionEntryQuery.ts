import { withEntityQuery } from "@use-pico/client/query";
import { transactionEntryCollectionFn } from "~/server/@user/transaction-entry/fn/transactionEntryCollectionFn";
import { transactionEntryCountFn } from "~/server/@user/transaction-entry/fn/transactionEntryCountFn";
import { transactionEntryCreateFn } from "~/server/@user/transaction-entry/fn/transactionEntryCreateFn";
import { transactionEntryFetchFn } from "~/server/@user/transaction-entry/fn/transactionEntryFetchFn";
import type { TransactionEntryCountQuerySchema } from "~/server/@user/transaction-entry/schema/TransactionEntryCountQuerySchema";
import type { TransactionEntryCreateSchema } from "~/server/@user/transaction-entry/schema/TransactionEntryCreateSchema";
import type { TransactionEntryQuerySchema } from "~/server/@user/transaction-entry/schema/TransactionEntryQuerySchema";
import type { TransactionEntrySchema } from "~/server/@user/transaction-entry/schema/TransactionEntrySchema";

export const withTransactionEntryQuery = withEntityQuery<
	TransactionEntrySchema.Type,
	TransactionEntryQuerySchema.Type,
	TransactionEntryQuerySchema.Type,
	TransactionEntryCountQuerySchema.Type,
	never,
	TransactionEntryCreateSchema.Type,
	never,
	never
>({
	keys: () => [
		"transaction-entry",
	],
	toIdKey: (id) => ({
		where: {
			id,
		},
	}),
	async fetchFn(data) {
		return transactionEntryFetchFn({
			data,
		});
	},
	async collectionFn(data) {
		return transactionEntryCollectionFn({
			data,
		});
	},
	async countFn(data) {
		return transactionEntryCountFn({
			data,
		});
	},
	async createFn(data) {
		return transactionEntryCreateFn({
			data,
		});
	},
	async patchFn(_data) {
		throw new Error("Transaction entry patch is not supported.");
	},
	async patchCollectionFn(_data) {
		throw new Error("Transaction entry collection patch is not supported.");
	},
	async deleteFn(_data) {
		throw new Error("Transaction entry delete is not supported.");
	},
});
