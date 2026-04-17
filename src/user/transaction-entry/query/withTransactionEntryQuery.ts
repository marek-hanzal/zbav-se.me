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
	logger: getRootLogger([
		"query",
		"withTransactionEntryQuery",
	]),
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
