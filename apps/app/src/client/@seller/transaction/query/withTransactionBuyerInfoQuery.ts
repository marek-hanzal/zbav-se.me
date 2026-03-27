import { withQuery } from "@use-pico/client/query";
import { transactionBuyerInfoFn } from "~/server/@seller/transaction/fn/transactionBuyerInfoFn";
import type { TransactionBuyerInfoSchema } from "~/server/@seller/transaction/schema/TransactionBuyerInfoSchema";
import type { TransactionQuerySchema } from "~/server/@seller/transaction/schema/TransactionQuerySchema";

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
		return transactionBuyerInfoFn({
			data,
		});
	},
});
