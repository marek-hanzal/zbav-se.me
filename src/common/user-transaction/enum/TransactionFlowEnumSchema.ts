import { z } from "zod";

export const TransactionFlowEnumSchema = z
	.enum([
		"seller-to-buyer",
		"buyer-to-seller",
		"archived",
	])
	.meta({
		id: "TransactionFlowEnum",
		description: `
Defines the flow between sides and available queries:
- seller-to-buyer (waiting for buyer's action)
- buyer-to-seller (waiting for seller's action)
- archived - done, finished, no further actions available (for both)
        `.trim(),
	});

export type TransactionFlowEnumSchema = typeof TransactionFlowEnumSchema;

export namespace TransactionFlowEnumSchema {
	export type Type = z.infer<TransactionFlowEnumSchema>;
}
