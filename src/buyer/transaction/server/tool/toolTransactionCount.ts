import { tool } from "@openai/agents";
import { transactionCountFn } from "~/buyer/transaction/fn/transactionCountFn";
import { TransactionCountQuerySchema } from "~/buyer/transaction/server/schema/TransactionCountQuerySchema";
import { getRootLogger } from "~/server/log/getRootLogger";

const logger = getRootLogger([
	"tool",
	"toolTransactionCount",
]);

export const toolTransactionCount = tool({
	name: "transaction-count",
	needsApproval: false,
	description: "Count buyer transactions matching the provided query.",
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
