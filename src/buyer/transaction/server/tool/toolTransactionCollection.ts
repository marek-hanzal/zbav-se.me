import { tool } from "@openai/agents";
import { transactionCollectionFn } from "~/buyer/transaction/fn/transactionCollectionFn";
import { TransactionQuerySchema } from "~/buyer/transaction/server/schema/TransactionQuerySchema";
import { getRootLogger } from "~/server/log/getRootLogger";

const logger = getRootLogger([
	"tool",
	"toolTransactionCollection",
]);

export const toolTransactionCollection = tool({
	name: "buyer-transaction-collection",
	needsApproval: false,
	description: `
        Buyer-side transaction collection. Use small cursors and compact filters only.

        Use for finding transactions and reading transaction metadata. For message/timeline content, use buyer-transaction-entry-collection with the transactionId.

        Transaction statuses:
        - pending: New, fresh transaction.
        - open: Accepted and active transaction; normal transaction work happens here.
        - resolved: Resolved by the seller, for example when the package was sent.
        - dispute: Active transaction switched to dispute mode, for example when the buyer has a complaint.
        - sold: Marked as sold outside of the standard happy-path result flow.
        - rejected: Explicitly closed by the seller or buyer.
        - expired: Expired with no action received from either side.
        - success: Buyer confirmed they are happy with the result.
        - closed: Explicitly closed without a success or rejection outcome.

        Sort fields:
        - createdAt: When the transaction was created.
        - updatedAt: When the transaction was last updated.
        - expiresAt: When the transaction expires.
        - lastAt: Last transaction activity timestamp.
        - status: Current transaction status.
    `.trim(),
	parameters: TransactionQuerySchema,
	async execute(data) {
		logger.trace("toolTransactionCollection", {
			data,
		});

		const items = await transactionCollectionFn({
			data: {
				...data,
				limit: 8,
			},
		});

		return {
			count: items.length,
			items,
		};
	},
});
