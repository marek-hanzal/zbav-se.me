import { tool } from "@openai/agents";
import { stringify } from "csv-stringify/sync";
import { z } from "zod";
import { transactionCollectionFn as buyerTransactionCollectionFn } from "~/buyer/transaction/fn/transactionCollectionFn";
import { getRootLogger } from "~/common/log/getRootLogger";
import { TransactionStatusEnumSchema } from "~/common/user-transaction/enum/TransactionStatusEnumSchema";
import { transactionCollectionFn as sellerTransactionCollectionFn } from "~/seller/transaction/fn/transactionCollectionFn";
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
	name: "transaction-browse",
	needsApproval: false,
	description: `
Browse the user's trade transactions from both seller and buyer side in one list (here you can get 'transactionId' for transaction-entry).

- Don't leak internal ID's
- Keep an eye on 'expiresAt', check if the transaction is near expiration date and tell the user if so
- Transaction expiration !== listing expiration
- Order is from the most recent activity across both seller and buyer side
- There is listing 'title'
- You can use 'unreadCount' to get number of items a user must react to
		`.trim(),
	strict: true,
	parameters: unsafeJsonSchema(InputSchema),
	async execute(input) {
		logger.trace("toolTransactionBrowse", {
			input,
		});

		const where = await InputSchema.parseAsync(input);

		const [sellerItems, buyerItems] = await Promise.all([
			sellerTransactionCollectionFn({
				data: {
					where,
					sort: [
						{
							field: "lastAt",
							order: "desc",
						},
					],
					limit: 10,
				},
			}),
			buyerTransactionCollectionFn({
				data: {
					where,
					sort: [
						{
							field: "lastAt",
							order: "desc",
						},
					],
					limit: 10,
				},
			}),
		]);

		if (!sellerItems.length && !buyerItems.length) {
			return "nothing";
		}

		const seller = stringify(
			sellerItems.map((item) => ({
				transactionId: item.id,
				// title: item.title,
				status: item.status,
				unread: item.unread,
				updatedAt: item.updatedAt.toISOString(),
				expiresAt: item.expiresAt.toISOString(),
			})),
			{
				header: true,
				delimiter: "\n",
				columns: [
					"transactionId",
					"title",
					"unread",
					"status",
					"updatedAt",
					"expiresAt",
				],
			},
		);
		const buyer = stringify(
			buyerItems.map((item) => ({
				transactionId: item.id,
				title: item.title,
				status: item.status,
				unread: item.unread,
				updatedAt: item.updatedAt.toISOString(),
				expiresAt: item.expiresAt.toISOString(),
			})),
			{
				header: true,
				delimiter: "\n",
				columns: [
					"transactionId",
					"title",
					"unread",
					"status",
					"updatedAt",
					"expiresAt",
				],
			},
		);

		return `
Seller:
${sellerItems.length > 0 ? seller : "empty"}

Buyer:
${buyerItems.length > 0 ? buyer : "empty"}
        `.trim();
	},
});
