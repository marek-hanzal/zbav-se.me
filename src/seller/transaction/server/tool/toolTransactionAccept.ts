import { tool } from "@openai/agents";
import { EntitySchema } from "@/lib/common/schema";
import { transactionAcceptFn } from "~/seller/transaction/fn/transactionAcceptFn";
import { getRootLogger } from "~/server/log/getRootLogger";

const logger = getRootLogger([
	"tool",
	"toolTransactionAccept",
]);

export const toolTransactionAccept = tool({
	name: "seller-transaction-accept",
	needsApproval: false,
	description: `
Seller-side transaction action: accept/open a pending transaction.

Use only after you know the current user is acting as the seller, meaning the user owns the
listing in this transaction. If the role is unknown, first fetch the transaction from the buyer/seller
transaction collection tools and choose the tool matching the user's side.

Use when the seller explicitly wants to accept a pending buyer request and open the transaction. Requires
the exact transaction id as id.
	`.trim(),
	parameters: EntitySchema,
	async execute(data) {
		logger.trace("toolTransactionAccept", {
			data,
		});

		return transactionAcceptFn({
			data,
		});
	},
});
