import { withEntityQuery } from "@use-pico/client/query";
import { transactionEntryCollectionFn } from "~/client/@user/transaction-entry/server/fn/transactionEntryCollectionFn";
import { transactionEntryCountFn } from "~/client/@user/transaction-entry/server/fn/transactionEntryCountFn";
import { transactionEntryCreateFn } from "~/client/@user/transaction-entry/server/fn/transactionEntryCreateFn";
import { transactionEntryFetchFn } from "~/client/@user/transaction-entry/server/fn/transactionEntryFetchFn";
import type { TransactionEntryCountQuerySchema } from "~/client/@user/transaction-entry/server/schema/TransactionEntryCountQuerySchema";
import type { TransactionEntryCreateSchema } from "~/client/@user/transaction-entry/server/schema/TransactionEntryCreateSchema";
import type { TransactionEntryQuerySchema } from "~/client/@user/transaction-entry/server/schema/TransactionEntryQuerySchema";
import type { TransactionEntrySchema } from "~/client/@user/transaction-entry/server/schema/TransactionEntrySchema";

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
