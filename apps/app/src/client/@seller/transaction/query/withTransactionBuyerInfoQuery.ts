import { withQuery } from "@use-pico/client/query";
import { transactionBuyerInfoFn } from "~/client/@seller/transaction/server/fn/transactionBuyerInfoFn";
import type { TransactionBuyerInfoSchema } from "~/client/@seller/transaction/server/schema/TransactionBuyerInfoSchema";
import type { TransactionQuerySchema } from "~/client/@seller/transaction/server/schema/TransactionQuerySchema";

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
