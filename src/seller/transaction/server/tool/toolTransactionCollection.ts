import { tool } from "@openai/agents";
import { transactionCollectionFn } from "~/seller/transaction/fn/transactionCollectionFn";
import { TransactionQuerySchema } from "~/seller/transaction/server/schema/TransactionQuerySchema";
import { getRootLogger } from "~/server/log/getRootLogger";

const logger = getRootLogger([
	"tool",
	"toolTransactionCollection",
]);

export const toolTransactionCollection = tool({
	name: "seller-transaction-collection",
	needsApproval: false,
	description: `
        Seller transaction collection. Use small cursors and compact filters only.

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

        For getting content (timeline) use seller-transaction-entry-collection tool.
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
