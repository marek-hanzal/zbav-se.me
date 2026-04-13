import { tool } from "@openai/agents";
import { transactionCountFn } from "~/seller/transaction/fn/transactionCountFn";
import { TransactionCountQuerySchema } from "~/seller/transaction/server/schema/TransactionCountQuerySchema";
import { getRootLogger } from "~/server/log/getRootLogger";

const logger = getRootLogger([
	"tool",
	"toolTransactionCount",
]);

export const toolTransactionCount = tool({
	name: "transaction-count",
	needsApproval: false,
	description: "Count seller transactions matching the provided query.",
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
