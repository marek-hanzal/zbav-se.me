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
