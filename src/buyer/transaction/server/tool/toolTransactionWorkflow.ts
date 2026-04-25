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
Buyer-side transaction (status) action.

Use only when the current user is the buyer in this transaction.
If perspective is unknown, resolve it first.

Actions:
- reject: buyer rejects the transaction (buyer does not want to continue the trade)
- dispute: buyer opens a dispute (something went wrong, flow just between users)
- success: buyer confirms the transaction successfully finished
- close: buyer closes the transaction without confirming success

Requires the exact buyer-side 'transactionId'.
	`.trim(),
	strict: true,
	parameters: unsafeJsonSchema(InputSchema),
	async execute(input) {
		logger.trace("toolTransactionWorkflow", {
			input,
		});

		const { type, transactionId } = await InputSchema.parseAsync(input);

		await match(type)
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

		return "ok";
	},
});
