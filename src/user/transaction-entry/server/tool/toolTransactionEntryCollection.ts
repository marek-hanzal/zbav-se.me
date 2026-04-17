import { tool } from "@openai/agents";
import { match } from "ts-pattern";
import { z } from "zod";
import { getRootLogger } from "~/common/log/getRootLogger";
import { transactionEntryCollectionFn } from "~/user/transaction-entry/fn/transactionEntryCollectionFn";
import { transactionEntryCountFn } from "~/user/transaction-entry/fn/transactionEntryCountFn";
import { TransactionEntryToolQuerySchema } from "~/user/transaction-entry/server/schema/TransactionEntryToolQuerySchema";

const logger = getRootLogger([
	"tool",
	"toolTransactionEntryCollection",
]);

export const toolTransactionEntryCollection = tool({
	name: "transaction-entry-collection",
	needsApproval: false,
	description: `
Transaction timeline and message entries.

Modes:
- collection: return matching transaction entries
- count: return how many matching transaction entries exist

Use for trade message content, timeline content, structured exchange data, and transaction history.
Prefer an exact transactionId when available.
    `.trim(),
	parameters: z
		.looseObject({
			type: z.enum([
				"count",
				"collection",
			]),
			query: TransactionEntryToolQuerySchema,
		})
		.strip(),
	async execute({ type, query }) {
		logger.trace("toolTransactionEntryCollection", {
			type,
			query,
		});

		return match(type)
			.with("count", async () => {
				const count = await transactionEntryCountFn({
					data: query,
				});

				const hasMore = await transactionEntryCountFn({
					data: {},
				});

				return {
					count: count,
					hasMore: hasMore > 0,
				} as const;
			})
			.with("collection", async () => {
				const items = await transactionEntryCollectionFn({
					data: {
						...query,
						limit: 8,
					},
				});

				return {
					count: items.length,
					items,
				} as const;
			})
			.exhaustive();
	},
});
