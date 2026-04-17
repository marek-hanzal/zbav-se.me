import { getRootLogger } from "@/lib/client/log";
import { withEntityQuery } from "@/lib/client/query";
import { transactionListingCollectionFn } from "~/seller/transaction-listing/fn/transactionListingCollectionFn";
import { transactionListingCountFn } from "~/seller/transaction-listing/fn/transactionListingCountFn";
import { transactionListingFetchFn } from "~/seller/transaction-listing/fn/transactionListingFetchFn";
import type { TransactionListingCountQuerySchema } from "~/seller/transaction-listing/server/schema/TransactionListingCountQuerySchema";
import type { TransactionListingQuerySchema } from "~/seller/transaction-listing/server/schema/TransactionListingQuerySchema";
import type { TransactionListingSchema } from "~/seller/transaction-listing/server/schema/TransactionListingSchema";

const logger = getRootLogger([
	"query",
	"withTransactionListingQuery",
]);

export const withTransactionListingQuery = withEntityQuery<
	TransactionListingSchema.Type,
	TransactionListingQuerySchema.Type,
	TransactionListingQuerySchema.Type,
	TransactionListingCountQuerySchema.Type,
	never,
	never,
	never,
	never
>({
	keys: () => [
		"seller",
		"transaction-listing",
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

		return transactionListingFetchFn({
			data,
		});
	},
	async collectionFn(data, context) {
		logger.trace("collectionFn", {
			data,
			context,
		});

		return transactionListingCollectionFn({
			data,
		});
	},
	async countFn(data, context) {
		logger.trace("countFn", {
			data,
			context,
		});

		return transactionListingCountFn({
			data,
		});
	},
	async createFn(_data, _context) {
		throw new Error("Transaction listing create is not supported.");
	},
	async deleteFn(_data, _context) {
		throw new Error("Transaction listing delete is not supported.");
	},
	async patchFn(_data, _context) {
		throw new Error("Transaction listing patch is not supported.");
	},
	async patchCollectionFn(_data, _context) {
		throw new Error("Transaction listing collection patch is not supported.");
	},
});
