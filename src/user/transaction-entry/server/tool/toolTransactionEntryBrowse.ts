import { tool } from "@openai/agents";
import { stringify } from "csv-stringify/sync";
import { z } from "zod";
import { getRootLogger } from "~/common/log/getRootLogger";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";
import { transactionEntryCollectionFn } from "~/user/transaction-entry/fn/transactionEntryCollectionFn";

const logger = getRootLogger([
	"tool",
	"toolTransactionEntryBrowse",
]);

const InputSchema = z
	.looseObject({
		transactionId: z.string().meta({
			description: "Transaction is required to get messages",
		}),
	})
	.strip()
	.meta({
		description: "Query object for transaction entry tool",
	});

export const toolTransactionEntryBrowse = tool({
	name: "transaction-entry-browse",
	needsApproval: false,
	description: `
Tool to get events (messages) in transaction (listing trade).

You must have 'transactionId' before using this tool.

- You may get text messages
- You may get status updates
- Translate status items/non-text messages (entries) to user's language
    `.trim(),
	strict: true,
	parameters: unsafeJsonSchema(InputSchema),
	async execute(input) {
		logger.trace("toolTransactionEntryBrowse", {
			input,
		});

		const filter = await InputSchema.parseAsync(input);

		const items = await transactionEntryCollectionFn({
			data: {
				filter,
				sort: [
					{
						field: "createdAt",
						order: "desc",
					},
				],
				limit: 8,
			},
		});

		if (!items.length) {
			return "nothing";
		}

		return stringify(
			items.map((item) => ({
				id: item.id,
				createdAt: item.createdAt,
			})),
			{
				header: true,
				delimiter: "\t",
				columns: [
					"id",
					"createdAt",
				],
			},
		);
	},
});
