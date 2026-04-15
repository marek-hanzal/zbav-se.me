import { tool } from "@openai/agents";
import { EntitySchema } from "@/lib/common/schema";
import { transactionResolveFn } from "~/seller/transaction/fn/transactionResolveFn";
import { getRootLogger } from "~/server/log/getRootLogger";

const logger = getRootLogger([
	"tool",
	"toolTransactionResolve",
]);

export const toolTransactionResolve = tool({
	name: "seller-transaction-resolve",
	needsApproval: false,
	description: `
Seller-side transaction action: mark a transaction as resolved.

Use only after you know the current user is acting as the seller, meaning the user owns the
listing in this transaction. If the role is unknown, first fetch the transaction from the buyer/seller
transaction collection tools and choose the tool matching the user's side.

Use when the seller explicitly says the transaction is resolved, ready for buyer confirmation, handed
over, sent, completed from seller side, or re-resolved after a dispute. Requires the exact transaction id as id.
	`.trim(),
	parameters: EntitySchema,
	async execute(data) {
		logger.trace("toolTransactionResolve", {
			data,
		});

		return transactionResolveFn({
			data,
		});
	},
});
