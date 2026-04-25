import { tool } from "@openai/agents";
import { z } from "zod";
import { getRootLogger } from "~/common/log/getRootLogger";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";
import { transactionMessageActivityArchiveFn } from "~/user/transaction/fn/transactionMessageActivityArchiveFn";

const logger = getRootLogger([
	"tool",
	"toolTransactionAcknowledge",
]);

const InputSchema = z
	.looseObject({
		transactions: z.array(
			z
				.looseObject({
					listingId: z.string().min(1).meta({
						description: "Exact listing ID related to the message activity",
					}),
					transactionId: z.string().min(1).meta({
						description: "Exact transaction ID related to the message activity",
					}),
					type: z
						.enum([
							"buyer-message",
							"seller-message",
						])
						.meta({
							description: "Message activity type to archive",
						}),
				})
				.strip(),
		),
	})
	.strip();

export const toolTransactionAcknowledge = tool({
	name: "transaction-acknowledge",
	needsApproval: false,
	description: `
Archive transaction message activity for the current user.

Use it when a message notification should be dismissed after the user handled it.
- Requires exact listingId and transactionId from another tool
- Use buyer-message or seller-message based on the activity/message side
- If you can submit multiple messages using single run
	`.trim(),
	strict: true,
	parameters: unsafeJsonSchema(InputSchema),
	async execute(input) {
		logger.trace("toolTransactionAcknowledge", {
			input,
		});

		const data = await InputSchema.parseAsync(input);

		await Promise.all(
			data.transactions.map((data) => {
				return transactionMessageActivityArchiveFn({
					data,
				});
			}),
		);

		return "ok";
	},
});
