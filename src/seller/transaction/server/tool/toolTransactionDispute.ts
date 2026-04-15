import { tool } from "@openai/agents";
import { EntitySchema } from "@/lib/common/schema";
import { transactionDisputeFn } from "~/seller/transaction/fn/transactionDisputeFn";
import { getRootLogger } from "~/server/log/getRootLogger";

const logger = getRootLogger([
	"tool",
	"toolTransactionDispute",
]);

export const toolTransactionDispute = tool({
	name: "seller-transaction-dispute",
	needsApproval: false,
	description: `
Seller-side transaction action: open a dispute.

Use only after you know the current user is acting as the seller, meaning the user owns the listing
in this transaction. If the role is unknown, first fetch the transaction from the buyer/seller transaction
collection tools and choose the tool matching the user's side.

Use when the seller explicitly reports a problem, complaint, disagreement, or wants to dispute a resolved
transaction. Requires the exact transaction id as id.
	`.trim(),
	parameters: EntitySchema,
	async execute(data) {
		logger.trace("toolTransactionDispute", {
			data,
		});

		return transactionDisputeFn({
			data,
		});
	},
});
