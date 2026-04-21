import { tool } from "@openai/agents";
import { match } from "ts-pattern";
import { z } from "zod";
import { transactionCloseFn } from "~/buyer/transaction/fn/transactionCloseFn";
import { transactionDisputeFn } from "~/buyer/transaction/fn/transactionDisputeFn";
import { transactionRejectFn } from "~/buyer/transaction/fn/transactionRejectFn";
import { transactionSuccessFn } from "~/buyer/transaction/fn/transactionSuccessFn";
import { getRootLogger } from "~/common/log/getRootLogger";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";

const logger = getRootLogger([
	"tool",
	"toolTransactionWorkflow",
]);

const InputSchema = z
	.looseObject({
		transactionId: z.string().meta({
			description: "Exact buyer-side transaction ID",
		}),
		type: z
			.enum([
				"close",
				"dispute",
				"reject",
				"success",
			])
			.meta({
				description: "Buyer workflow action to execute",
			}),
	})
	.strip();

export const toolTransactionWorkflow = tool({
	name: "buyer-transaction-workflow",
	needsApproval: false,
	description: `
Buyer-side transaction workflow action.

Use only when the current user is acting as the buyer in this transaction.
If the user's side is unknown, first fetch the transaction and confirm the perspective.

Supported actions:
- reject: buyer rejects the transaction (he does not want to continue a transaction)
- dispute: buyer opens a dispute/complaint
- success: buyer confirms the transaction (happy path, buyer is happy with the trade)
- close: buyer closes the transaction (this is neutral state - it's just I'm OK, close it)

Requires the exact buyer-side transaction id.
	`.trim(),
	strict: true,
	parameters: unsafeJsonSchema(InputSchema),
	async execute(input) {
		logger.trace("toolTransactionWorkflow", {
			input,
		});

		const { type, transactionId } = await InputSchema.parseAsync(input);

		return match(type)
			.with("close", () => {
				return transactionCloseFn({
					data: {
						id: transactionId,
					},
				});
			})
			.with("dispute", () => {
				return transactionDisputeFn({
					data: {
						id: transactionId,
					},
				});
			})
			.with("success", () => {
				return transactionSuccessFn({
					data: {
						id: transactionId,
					},
				});
			})
			.with("reject", () => {
				return transactionRejectFn({
					data: {
						id: transactionId,
					},
				});
			})
			.exhaustive();
	},
});
