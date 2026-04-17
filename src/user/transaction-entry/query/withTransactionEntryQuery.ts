import { getRootLogger } from "@/lib/client/log";
import { withEntityQuery } from "@/lib/client/query";
import { transactionEntryCollectionFn } from "~/user/transaction-entry/fn/transactionEntryCollectionFn";
import { transactionEntryCountFn } from "~/user/transaction-entry/fn/transactionEntryCountFn";
import { transactionEntryCreateFn } from "~/user/transaction-entry/fn/transactionEntryCreateFn";
import { transactionEntryFetchFn } from "~/user/transaction-entry/fn/transactionEntryFetchFn";
import type { TransactionEntryCountQuerySchema } from "~/user/transaction-entry/server/schema/TransactionEntryCountQuerySchema";
import type { TransactionEntryCreateSchema } from "~/user/transaction-entry/server/schema/TransactionEntryCreateSchema";
import type { TransactionEntryQuerySchema } from "~/user/transaction-entry/server/schema/TransactionEntryQuerySchema";
import type { TransactionEntrySchema } from "~/user/transaction-entry/server/schema/TransactionEntrySchema";

const logger = getRootLogger([
	"query",
	"withTransactionEntryQuery",
]);

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
	async fetchFn(data, context) {
		logger.trace("fetchFn", {
			data,
			context,
		});

		return transactionEntryFetchFn({
			data,
		});
	},
	async collectionFn(data, context) {
		logger.trace("collectionFn", {
			data,
			context,
		});

		return transactionEntryCollectionFn({
			data,
		});
	},
	async countFn(data, context) {
		logger.trace("countFn", {
			data,
			context,
		});

		return transactionEntryCountFn({
			data,
		});
	},
	async createFn(data, context) {
		logger.trace("createFn", {
			data,
			context,
		});

		return transactionEntryCreateFn({
			data,
		});
	},
	async patchFn(_data, _context) {
		throw new Error("Transaction entry patch is not supported.");
	},
	async patchCollectionFn(_data, _context) {
		throw new Error("Transaction entry collection patch is not supported.");
	},
	async deleteFn(_data, _context) {
		throw new Error("Transaction entry delete is not supported.");
	},
});
