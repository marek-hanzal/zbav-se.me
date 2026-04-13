import { tool } from "@openai/agents";
import { transactionCollectionFn } from "~/buyer/transaction/fn/transactionCollectionFn";
import { TransactionQuerySchema } from "~/buyer/transaction/server/schema/TransactionQuerySchema";
import { getRootLogger } from "~/server/log/getRootLogger";

const logger = getRootLogger([
	"tool",
	"toolTransactionCollection",
]);

export const toolTransactionCollection = tool({
	name: "transaction-collection",
	needsApproval: false,
	description: `
        Buyer transaction collection. Use small cursors and compact filters only.
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
