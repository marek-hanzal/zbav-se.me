import { tool } from "@openai/agents";
import { EntitySchema } from "@/lib/common/schema";
import { transactionSuccessFn } from "~/buyer/transaction/fn/transactionSuccessFn";
import { getRootLogger } from "~/server/log/getRootLogger";

const logger = getRootLogger([
	"tool",
	"toolTransactionSuccess",
]);

export const toolTransactionSuccess = tool({
	name: "buyer-transaction-success",
	needsApproval: false,
	description: `
Buyer-side transaction action: mark a transaction as successful.

Use only after you know the current user is acting as the buyer in this transaction. If the role is
unknown, first fetch the transaction from the buyer/seller transaction collection tools and choose
the tool matching the user's side.

Use when the buyer explicitly confirms the transaction went well, the item/package arrived, or they
are satisfied with the result. Requires the exact transaction id as id.
	`.trim(),
	parameters: EntitySchema,
	async execute(data) {
		logger.trace("toolTransactionSuccess", {
			data,
		});

		return transactionSuccessFn({
			data,
		});
	},
});
