import { tool } from "@openai/agents";
import { EntitySchema } from "@/lib/common/schema";
import { transactionCloseFn } from "~/buyer/transaction/fn/transactionCloseFn";
import { getRootLogger } from "~/server/log/getRootLogger";

const logger = getRootLogger([
	"tool",
	"toolTransactionClose",
]);

export const toolTransactionClose = tool({
	name: "buyer-transaction-close",
	needsApproval: false,
	description: `
Buyer-side transaction action: close a transaction without confirming success.

Use only after you know the current user is acting as the buyer in this transaction. If the role is unknown,
first fetch the transaction from the buyer/seller transaction collection tools and choose the tool matching the user's side.

Use when the buyer explicitly wants to close/end the transaction without marking it successful, typically from resolved or
dispute states. Requires the exact transaction id as id.
	`.trim(),
	parameters: EntitySchema,
	async execute(data) {
		logger.trace("toolTransactionClose", {
			data,
		});

		return transactionCloseFn({
			data,
		});
	},
});
