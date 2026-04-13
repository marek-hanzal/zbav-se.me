import { tool } from "@openai/agents";
import { getRootLogger } from "~/server/log/getRootLogger";
import { transactionEntryCountFn } from "~/user/transaction-entry/fn/transactionEntryCountFn";
import { TransactionEntryCountQuerySchema } from "~/user/transaction-entry/server/schema/TransactionEntryCountQuerySchema";

const logger = getRootLogger([
	"tool",
	"toolTransactionEntryCount",
]);

export const toolTransactionEntryCount = tool({
	name: "transaction-entry-count",
	needsApproval: false,
	description: "Count buyer transaction entries matching the provided query.",
	parameters: TransactionEntryCountQuerySchema,
	async execute(data) {
		logger.trace("toolTransactionEntryCount", {
			data,
		});

		return transactionEntryCountFn({
			data,
		});
	},
});
