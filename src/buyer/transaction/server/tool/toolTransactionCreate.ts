import { tool } from "@openai/agents";
import { transactionCreateFn } from "~/buyer/transaction/fn/transactionCreateFn";
import { TransactionCreateSchema } from "~/buyer/transaction/server/schema/TransactionCreateSchema";
import { getRootLogger } from "~/common/log/getRootLogger";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";

const logger = getRootLogger([
	"tool",
	"toolTransactionCreate",
]);

const InputSchema = TransactionCreateSchema;

export const toolTransactionCreate = tool({
	name: "buyer-transaction-create",
	needsApproval: false,
	description: `
Buyer-side transaction action: create/open a new transaction for a concrete listing.

- Use only when the current user clearly wants to start a transaction with the seller for a specific listing
	`.trim(),
	strict: true,
	parameters: unsafeJsonSchema(InputSchema),
	async execute(input) {
		logger.trace("toolTransactionCreate", {
			input,
		});

		const data = await InputSchema.parseAsync(input);

		const transaction = await transactionCreateFn({
			data,
		});

		return `
ID: ${transaction.id}
        `.trim();
	},
});
