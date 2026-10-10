import { getRootLogger } from "~/log/fn/getRootLogger";
import { withQuery } from "~/query/fn/withQuery";
import { transactionBuyerInfoFn } from "~/seller-transaction/fn/transactionBuyerInfoFn";
import type { TransactionBuyerInfoSchema } from "~/seller-transaction/schema/TransactionBuyerInfoSchema";
import type { TransactionQuerySchema } from "~/seller-transaction/schema/TransactionQuerySchema";

export const withTransactionBuyerInfoQuery = withQuery({
	logger: getRootLogger([
		"query",
		"withTransactionBuyerInfoQuery",
	]),
	errors: {} as {
		query: transactionBuyerInfoFn.Error;
	},
	keys(data: TransactionQuerySchema.Type) {
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
