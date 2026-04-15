import { tool } from "@openai/agents";
import { EntitySchema } from "@/lib/common/schema";
import { transactionRejectFn } from "~/buyer/transaction/fn/transactionRejectFn";
import { getRootLogger } from "~/server/log/getRootLogger";

const logger = getRootLogger([
	"tool",
	"toolTransactionReject",
]);

export const toolTransactionReject = tool({
	name: "buyer-transaction-reject",
	needsApproval: false,
	description: `
Buyer-side transaction action: reject/cancel a transaction.

Use only after you know the current user is acting as the buyer in this transaction. If the
role is unknown, first fetch the transaction from the buyer/seller transaction collection tools
and choose the tool matching the user's side.

Use when the buyer explicitly wants to reject, cancel, decline, or stop the transaction. Requires
the exact transaction id as id.
	`.trim(),
	parameters: EntitySchema,
	async execute(data) {
		logger.trace("toolTransactionReject", {
			data,
		});

		return transactionRejectFn({
			data,
		});
	},
});
