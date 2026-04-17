import { getRootLogger } from "@/lib/client/log";
import { withQuery } from "@/lib/client/query";
import { transactionBuyerInfoFn } from "~/seller/transaction/fn/transactionBuyerInfoFn";
import type { TransactionBuyerInfoSchema } from "~/seller/transaction/server/schema/TransactionBuyerInfoSchema";
import type { TransactionQuerySchema } from "~/seller/transaction/server/schema/TransactionQuerySchema";

const logger = getRootLogger([
	"query",
	"withTransactionBuyerInfoQuery",
]);

export const withTransactionBuyerInfoQuery = withQuery<
	TransactionQuerySchema.Type,
	TransactionBuyerInfoSchema.Type
>({
	keys(data) {
		return [
			"seller",
			"transaction",
			"buyer-info",
			data,
		];
	},
	async queryFn(data) {
		logger.trace("queryFn", data);

		return transactionBuyerInfoFn({
			data,
		});
	},
});
