import { tool } from "@openai/agents";
import { match } from "ts-pattern";
import { z } from "zod";
import { getRootLogger } from "~/common/log/getRootLogger";
import { transactionAcceptFn } from "~/seller/transaction/fn/transactionAcceptFn";
import { transactionDisputeFn } from "~/seller/transaction/fn/transactionDisputeFn";
import { transactionRejectFn } from "~/seller/transaction/fn/transactionRejectFn";
import { transactionResolveFn } from "~/seller/transaction/fn/transactionResolveFn";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";

const logger = getRootLogger([
	"tool",
	"toolTransactionWorkflow",
]);

const InputSchema = z
	.looseObject({
		transactionId: z.string().meta({
			description: "Exact seller-side transaction ID",
		}),
		type: z
			.enum([
				"accept",
				"dispute",
				"reject",
				"resolve",
			])
			.meta({
				description: "Seller workflow action to execute",
			}),
	})
	.strip();

export const toolTransactionWorkflow = tool({
	name: "seller-transaction-workflow",
	needsApproval: false,
	description: `
Seller-side transaction action.

Use only when the current user is the seller in this transaction.
If perspective is unknown, resolve it first.

Actions:
- accept: seller accepts the buyer request (mandatory to start a trade/any kind of communication)
- reject: seller rejects the transaction (seller just does not want to accept the given trade)
- resolve: seller marks the transaction as completed (when e.g. item is exchanged, package sent, it's "done" on a seller side)
- dispute: seller opens a dispute (something went wrong, flow just between users)

Requires the exact seller-side transaction id.
	`.trim(),
	strict: true,
	parameters: unsafeJsonSchema(InputSchema),
	async execute(input) {
		logger.trace("toolTransactionWorkflow", {
			input,
		});

		const { type, transactionId } = await InputSchema.parseAsync(input);

		return match(type)
			.with("accept", () => {
				return transactionAcceptFn({
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
			.with("reject", () => {
				return transactionRejectFn({
					data: {
						id: transactionId,
					},
				});
			})
			.with("resolve", () => {
				return transactionResolveFn({
					data: {
						id: transactionId,
					},
				});
			})
			.exhaustive();
	},
});
