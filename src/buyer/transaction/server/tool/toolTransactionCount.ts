import { tool } from "@openai/agents";
import { transactionCountFn } from "~/buyer/transaction/fn/transactionCountFn";
import { TransactionToolQuerySchema } from "~/buyer/transaction/server/schema/TransactionToolQuerySchema";
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

Enum: Transaction status:
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
	parameters: TransactionToolQuerySchema.pick({
		filter: true,
	}),
	async execute(data) {
		logger.trace("toolTransactionCount", {
			data,
		});

		const count = await transactionCountFn({
			data,
		});

		const hasMore = await transactionCountFn({
			data: {},
		});

		return {
			count: count,
			hasMore: hasMore > 0,
		} as const;
	},
});
