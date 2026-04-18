import { withQuery } from "@/lib/client/query";
import { getRootLogger } from "~/common/log/getRootLogger";
import { transactionBuyerInfoFn } from "~/seller/transaction/fn/transactionBuyerInfoFn";
import type { TransactionBuyerInfoSchema } from "~/seller/transaction/server/schema/TransactionBuyerInfoSchema";
import type { TransactionQuerySchema } from "~/seller/transaction/server/schema/TransactionQuerySchema";

export const withTransactionBuyerInfoQuery = withQuery<
	TransactionQuerySchema.Type,
	TransactionBuyerInfoSchema.Type,
	transactionBuyerInfoFn.Error
>({
	logger: getRootLogger([
		"query",
		"withTransactionBuyerInfoQuery",
	]),
	keys(data) {
		return [
			"seller",
			"transaction",
			"buyer-info",
			data,
		];
	},
	async queryFn(data) {
		return transactionBuyerInfoFn({
			data,
		});
	},
});
