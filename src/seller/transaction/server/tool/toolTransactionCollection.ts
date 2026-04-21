import { tool } from "@openai/agents";
import { match } from "ts-pattern";
import { z } from "zod";
import { getRootLogger } from "~/common/log/getRootLogger";
import { transactionCollectionFn } from "~/seller/transaction/fn/transactionCollectionFn";
import { transactionCountFn } from "~/seller/transaction/fn/transactionCountFn";
import { TransactionToolQuerySchema } from "~/seller/transaction/server/schema/TransactionToolQuerySchema";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";

const logger = getRootLogger([
	"tool",
	"toolTransactionCollection",
]);

const InputSchema = z
	.looseObject({
		type: z.enum([
			"count",
			"collection",
		]),
		query: TransactionToolQuerySchema,
	})
	.strip();

export const toolTransactionCollection = tool({
	name: "seller-transaction-collection",
	needsApproval: false,
	description: `
Current seller user's transactions matching the query.

Modes:
- collection: return a small page of matching transactions
- count: return how many matching transactions exist

Use for seller-side transaction lookup and transaction metadata.
Do not use for trade message/timeline content.
    `.trim(),
	strict: true,
	parameters: unsafeJsonSchema(InputSchema),
	async execute(input) {
		logger.trace("toolTransactionCollection", {
			input,
		});

		const { type, query } = await InputSchema.parseAsync(input);

		return match(type)
			.with("count", async () => {
				const count = await transactionCountFn({
					data: query,
				});

				const hasMore = await transactionCountFn({
					data: {},
				});

				return {
					count: count,
					hasMore: hasMore > 0,
				} as const;
			})
			.with("collection", async () => {
				const items = await transactionCollectionFn({
					data: {
						...query,
						limit: 8,
					},
				});

				return {
					count: items.length,
					items,
				};
			})
			.exhaustive();
	},
});
