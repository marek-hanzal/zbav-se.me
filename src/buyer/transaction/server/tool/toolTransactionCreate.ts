import { tool } from "@openai/agents";
import { transactionCreateFn } from "~/buyer/transaction/fn/transactionCreateFn";
import { TransactionCreateSchema } from "~/buyer/transaction/server/schema/TransactionCreateSchema";
import { getRootLogger } from "~/common/log/getRootLogger";

const logger = getRootLogger([
	"tool",
	"toolTransactionCreate",
]);

export const toolTransactionCreate = tool({
	name: "buyer-transaction-create",
	needsApproval: false,
	description: `
Buyer-side transaction action: create/open a new transaction for a concrete listing.

Use only when the current user clearly wants to start a transaction with the seller for a specific listing. Requires the exact listingId.

Before using:
- If the user references a listing vaguely, first find the listing and confirm the exact listingId.
- If the listing result already has transactionId, do not create a new transaction; use the existing buyer transaction instead.
- Do not use from seller perspective. Sellers accept/reject/resolve/dispute existing transactions; buyers create new transactions for listings.
- Do not invent listingId from title text. Resolve it through listing tools first.

This creates a pending transaction, links the buyer and listing owner as participants, writes the pending status entry, and notifies the seller.
	`.trim(),
	parameters: TransactionCreateSchema,
	async execute(data) {
		logger.trace("toolTransactionCreate", {
			data,
		});

		return transactionCreateFn({
			data,
		});
	},
});
