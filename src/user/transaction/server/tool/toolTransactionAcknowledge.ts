import { tool } from "@openai/agents";
import { match } from "ts-pattern";
import { z } from "zod";
import { transactionAckFn as buyerTransactionAckFn } from "~/buyer/transaction/fn/transactionAckFn";
import { getRootLogger } from "~/common/log/getRootLogger";
import { transactionAckFn as sellerTransactionAckFn } from "~/seller/transaction/fn/transactionAckFn";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";

const logger = getRootLogger([
	"tool",
	"toolTransactionAcknowledge",
]);

const TransactionSchema = z
	.looseObject({
		listingId: z.string().min(1).meta({
			description: "Exact listing ID linked to the handled message",
		}),
		transactionId: z.string().min(1).meta({
			description: "Exact transaction ID linked to the handled message",
		}),
		side: z
			.enum([
				"buyer",
				"seller",
			])
			.meta({
				description:
					"Current user's inbox side. Use buyer for seller-to-buyer handled messages. Use seller for buyer-to-seller handled messages.",
			}),
	})
	.strip();

const InputSchema = z
	.looseObject({
		transactions: z.array(TransactionSchema).min(1).meta({
			description: "One or more handled messages to acknowledge",
		}),
	})
	.strip();

export const toolTransactionAcknowledge = tool({
	name: "transaction-acknowledge",
	needsApproval: false,
	description: `
Explicitly acknowledge handled transaction messages and dismiss their inbox activity for the current user.

Use this when the user says things like:
- "I know", "got it", "hotovo", "vyřízený"
- "mark this handled", "dismiss this message", "clear this from inbox"
- the user cannot do anything else in that message and just wants it out of the way

Important:
- this does not change the transaction status
- this only hides matching activity for the current user
- requires exact listingId and transactionId from another tool
- side must match the current user's inbox perspective:
  - buyer = acknowledge a seller-to-buyer handled message
  - seller = acknowledge a buyer-to-seller handled message
- you may acknowledge multiple messages in one call
	`.trim(),
	strict: true,
	parameters: unsafeJsonSchema(InputSchema),
	async execute(input) {
		logger.trace("toolTransactionAcknowledge", {
			input,
		});

		const data = await InputSchema.parseAsync(input);

		await Promise.all(
			data.transactions.map((transaction) => {
				return match(transaction.side)
					.with("buyer", () => {
						return buyerTransactionAckFn({
							data: {
								listingId: transaction.listingId,
								transactionId: transaction.transactionId,
							},
						});
					})
					.with("seller", () => {
						return sellerTransactionAckFn({
							data: {
								listingId: transaction.listingId,
								transactionId: transaction.transactionId,
							},
						});
					})
					.exhaustive();
			}),
		);

		return "ok";
	},
});
