import { tool } from "@openai/agents";
import { match } from "ts-pattern";
import { z } from "zod";
import { transactionCollectionFn } from "~/buyer/transaction/fn/transactionCollectionFn";
import { transactionCountFn } from "~/buyer/transaction/fn/transactionCountFn";
import { TransactionToolQuerySchema } from "~/buyer/transaction/server/schema/TransactionToolQuerySchema";
import { getRootLogger } from "~/common/log/getRootLogger";
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
	name: "buyer-transaction-collection",
	needsApproval: false,
	description: `
Current buyer user's transactions (trades) matching the query.

Modes:
- collection: return a small page of matching transactions
- count: return how many matching transactions exist

Use for buyer-side transaction lookup and transaction metadata.
Do not use for trade message/timeline content; use the transaction entry tool for that.
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
