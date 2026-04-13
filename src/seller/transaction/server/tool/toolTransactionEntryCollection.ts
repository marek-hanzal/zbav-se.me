import { tool } from "@openai/agents";
import { getRootLogger } from "~/server/log/getRootLogger";
import { transactionEntryCollectionFn } from "~/user/transaction-entry/fn/transactionEntryCollectionFn";
import { TransactionEntryQuerySchema } from "~/user/transaction-entry/server/schema/TransactionEntryQuerySchema";

const logger = getRootLogger([
	"tool",
	"toolTransactionEntryCollection",
]);

export const toolTransactionEntryCollection = tool({
	name: "transaction-entry-collection",
	needsApproval: false,
	description: `
        Seller transaction entry collection. Use small cursors and compact filters only.
    `.trim(),
	parameters: TransactionEntryQuerySchema,
	async execute(data) {
		logger.trace("toolTransactionEntryCollection", {
			data,
		});

		const items = await transactionEntryCollectionFn({
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
