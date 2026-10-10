import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withQueryFn } from "~/query/fn/withQueryFn";
import { transactionBuyerInfoFn } from "~/seller-transaction/fn/transactionBuyerInfoFn";
import type { TransactionBuyerInfoSchema } from "~/seller-transaction/schema/TransactionBuyerInfoSchema";
import type { TransactionQuerySchema } from "~/seller-transaction/schema/TransactionQuerySchema";

export const withTransactionBuyerInfoQuery = withQueryFn({
	logger: getRootLoggerFn([
		"query",
		"withTransactionBuyerInfoQuery",
	]),
	errors: {} as {
		query: transactionBuyerInfoFn.Error;
	},
	keysFn(data: TransactionQuerySchema.Type) {
		return [
			"seller",
			"transaction",
			"buyer-info",
			data,
		];
	},
	async queryFn(data: TransactionQuerySchema.Type): Promise<TransactionBuyerInfoSchema.Type> {
		return transactionBuyerInfoFn({
			data,
		});
	},
});
