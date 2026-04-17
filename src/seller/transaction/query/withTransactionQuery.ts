import { getRootLogger } from "@/lib/client/log";
import { withEntityQuery } from "@/lib/client/query";
import { transactionCollectionFn } from "~/seller/transaction/fn/transactionCollectionFn";
import { transactionCountFn } from "~/seller/transaction/fn/transactionCountFn";
import { transactionFetchFn } from "~/seller/transaction/fn/transactionFetchFn";
import type { TransactionCountQuerySchema } from "~/seller/transaction/server/schema/TransactionCountQuerySchema";
import type { TransactionQuerySchema } from "~/seller/transaction/server/schema/TransactionQuerySchema";
import type { TransactionSchema } from "~/seller/transaction/server/schema/TransactionSchema";

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
	async createFn(_data, _context) {
		throw new Error("Transaction create is not supported.");
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
