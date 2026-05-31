import { tool } from "@openai/agents";
import { stringify } from "csv-stringify/sync";
import { match } from "ts-pattern";
import { z } from "zod";
import { getRootLogger } from "~/common/log/getRootLogger";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";
import { transactionEntryCollectionFn } from "~/user/transaction-entry/fn/transactionEntryCollectionFn";
import { transactionEntryGalleryFetchFn } from "~/user/transaction-entry/fn/transactionEntryGalleryFetchFn";

const logger = getRootLogger([
	"tool",
	"toolTransactionEntryBrowse",
]);

const InputSchema = z
	.looseObject({
		transactionIdIn: z.array(z.string()).meta({
			description: "Transactions are fetched using 'OR' (any of IDs present)",
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

- You must have valid (from another tool call) 'transactionId' before using this tool
- Don't invent your own 'transactionId'
- Translate status items/non-text messages (entries) to user's language
- If the transaction is in a terminal state with notification, offer the user acknowledging (transaction-acknowledge)

Direction field:
- in: message to current user
- out: message sent by the current user
- system: system message (visible to the user)

Status explanation:
- status-interest: Seller must react, there is waiting buyer (accept/reject a trade)
    `.trim(),
	strict: true,
	parameters: unsafeJsonSchema(InputSchema),
	async execute(input) {
		logger.trace("toolTransactionEntryBrowse", {
			input,
		});

		const where = await InputSchema.parseAsync(input);

		const items = await transactionEntryCollectionFn({
			data: {
				where,
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

		const rows = await Promise.all(
			items.map(async (item) => ({
				transactionEntryId: item.id,
				transactionId: item.transactionId,
				direction: item.direction,
				listingId: item.listingId,
				text: await match(item)
					.with(
						{
							kind: "text",
						},
						({ payload }) => {
							return payload.text;
						},
					)
					.with(
						{
							kind: "gallery",
						},
						async () => {
							/**
							 * The magick: galleries are protected, so we've to fetch them
							 * early as outside of this it's not possible to resolve 'galleryId'
							 * to real gallery.
							 */
							const gallery = await transactionEntryGalleryFetchFn({
								data: {
									where: {
										transactionEntryId: item.id,
									},
								},
							});
							const photoUrls = gallery.items.map((galleryItem) => {
								return galleryItem.upload.url;
							});

							return `Photo URLs: ${photoUrls.join(" | ") || "none"}`.trim();
						},
					)
					.with(
						{
							kind: "personal",
						},
						({ payload }) => {
							return `Name: ${payload.name ?? "none"} | Phone: ${payload.phone ?? "none"} | Email: ${payload.email ?? "none"}`.trim();
						},
					)
					.with(
						{
							kind: "location",
						},
						({ payload }) => {
							return `locationId: ${payload.locationId}`;
						},
					)
					.with(
						{
							kind: "package",
						},
						({ payload }) => {
							return `Tracking number: ${payload.number} | Tacking link: ${payload.link}`;
						},
					)
					.otherwise((item) => {
						return item.payload.text;
					}),
				createdAt: item.createdAt.toISOString(),
			})),
		);

		return stringify(rows, {
			header: true,
			delimiter: "\t",
			columns: [
				"direction",
				"transactionId",
				"listingId",
				"text",
				"createdAt",
				"transactionEntryId",
			],
		});
	},
});
