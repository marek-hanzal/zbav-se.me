import { tool } from "@openai/agents";
import { stringify } from "csv-stringify/sync";
import { z } from "zod";
import { getRootLogger } from "~/common/log/getRootLogger";
import { TransactionStatusEnumSchema } from "~/common/user-transaction/enum/TransactionStatusEnumSchema";
import { transactionCollectionFn } from "~/seller/transaction/fn/transactionCollectionFn";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";

const logger = getRootLogger([
	"tool",
	"toolTransactionBrowse",
]);

const InputSchema = z
	.looseObject({
		listingId: z.string().optional().meta({
			description: "This filter matches the exact listingId",
		}),
		statusIn: z.array(TransactionStatusEnumSchema).optional().meta({
			description:
				"This filter matches any of the provided statuses for the current status of the transaction",
		}),
		activity: z
			.enum([
				"unread",
				"archived",
			])
			.optional()
			.meta({
				description:
					"Controls if the transaction must also have an activity (user's notification)",
			}),
	})
	.strip();

export const toolTransactionBrowse = tool({
	name: "seller-transaction-browse",
	needsApproval: false,
	description: `
Browse seller's trade transactions (here you can get 'transactionId' for transaction-entry).

- Don't leak internal ID's
- Keep an eye on 'expiresAt', check if the transaction is near expiration date and tell the user if so
    Transaction expiration !== listing expiration
- Order is from the most recent activity
- There is listing 'title'
- You can use 'unreadCount' to get number of items a user must react to
    `.trim(),
	strict: true,
	parameters: unsafeJsonSchema(InputSchema),
	async execute(input) {
		logger.trace("toolTransactionCollection", {
			input,
		});

		const filter = await InputSchema.parseAsync(input);

		const items = await transactionCollectionFn({
			data: {
				filter,
				sort: [
					{
						field: "lastAt",
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
				transactionId: item.id,
				title: item.title,
				unreadCount: item.unreadCount,
				updatedAt: item.updatedAt.toISOString(),
				expiresAt: item.expiresAt.toISOString(),
			})),
			{
				header: true,
				delimiter: "\n",
				columns: [
					"transactionId",
					"title",
					"unreadCount",
					"updatedAt",
					"expiresAt",
				],
			},
		);
	},
});
