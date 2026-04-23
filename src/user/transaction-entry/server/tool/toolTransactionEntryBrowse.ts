import { tool } from "@openai/agents";
import { stringify } from "csv-stringify/sync";
import { match } from "ts-pattern";
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

- You must have valid (from another tool call) 'transactionId' before using this tool
- Don't invent your own 'transactionId'
- Translate status items/non-text messages (entries) to user's language

Direction field:
- in: message to current user
- out: message sent by the current user
- system: system message (visible to the user)
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
				direction: item.direction,
				text: match(item)
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
						({ payload }) => {
							return `galleryId: [${payload.galleryId}]`.trim();
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
				createdAt: item.createdAt,
			})),
			{
				header: true,
				delimiter: "\t",
				columns: [
					"id",
					"text",
					"createdAt",
				],
			},
		);
	},
});
