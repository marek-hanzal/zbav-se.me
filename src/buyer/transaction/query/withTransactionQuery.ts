import { getRootLogger } from "@/lib/client/log";
import { withEntityQuery } from "@/lib/client/query";
import { transactionCollectionFn } from "~/buyer/transaction/fn/transactionCollectionFn";
import { transactionCountFn } from "~/buyer/transaction/fn/transactionCountFn";
import { transactionCreateFn } from "~/buyer/transaction/fn/transactionCreateFn";
import { transactionFetchFn } from "~/buyer/transaction/fn/transactionFetchFn";
import type { TransactionCountQuerySchema } from "~/buyer/transaction/server/schema/TransactionCountQuerySchema";
import type { TransactionCreateSchema } from "~/buyer/transaction/server/schema/TransactionCreateSchema";
import type { TransactionQuerySchema } from "~/buyer/transaction/server/schema/TransactionQuerySchema";
import type { TransactionSchema } from "~/buyer/transaction/server/schema/TransactionSchema";

const logger = getRootLogger([
	"query",
	"withTransactionQuery",
]);

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
	async fetchFn(data, context) {
		logger.trace("fetchFn", {
			data,
			context,
		});

		return transactionFetchFn({
			data,
		});
	},
	async collectionFn(data, context) {
		logger.trace("collectionFn", {
			data,
			context,
		});

		return transactionCollectionFn({
			data,
		});
	},
	async countFn(data, context) {
		logger.trace("countFn", {
			data,
			context,
		});

		return transactionCountFn({
			data,
		});
	},
	async createFn(data, context) {
		logger.trace("createFn", {
			data,
			context,
		});

		return transactionCreateFn({
			data,
		});
	},
	async deleteFn(_data, _context) {
		throw new Error("Transaction delete is not supported.");
	},
	async patchFn(_data, _context) {
		throw new Error("Transaction patch is not supported.");
	},
	async patchCollectionFn(_data, _context) {
		throw new Error("Transaction collection patch is not supported.");
	},
});
