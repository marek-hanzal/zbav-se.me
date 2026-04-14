import { tool } from "@openai/agents";
import { transactionCountFn } from "~/buyer/transaction/fn/transactionCountFn";
import { TransactionCountQuerySchema } from "~/buyer/transaction/server/schema/TransactionCountQuerySchema";
import { getRootLogger } from "~/server/log/getRootLogger";

const logger = getRootLogger([
	"tool",
	"toolTransactionCount",
]);

export const toolTransactionCount = tool({
	name: "buyer-transaction-count",
	needsApproval: false,
	description: `
        Count buyer-side transactions matching the provided query.

        Transaction statuses:
        - pending: New, fresh transaction.
        - open: Accepted and active transaction.
        - resolved: Resolved by the seller, for example when the package was sent.
        - dispute: Active transaction switched to dispute mode.
        - sold: Marked as sold outside of the standard happy-path result flow.
        - rejected: Explicitly closed by the seller or buyer.
        - expired: Expired with no action received from either side.
        - success: Buyer confirmed they are happy with the result.
        - closed: Explicitly closed without a success or rejection outcome.
    `.trim(),
	parameters: TransactionCountQuerySchema,
	async execute(data) {
		logger.trace("toolTransactionCount", {
			data,
		});

		return transactionCountFn({
			data,
		});
	},
});
