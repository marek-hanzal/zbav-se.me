import { z } from "zod";

export const TransactionFlowEnumSchema = z
	.enum([
		"attention",
		"resolved",
		"archived",
	])
	.meta({
		id: "TransactionFlowEnum",
		description:
			"Group transactions per user's intent: those needs attention, those currently done, but active (resolved) and archived",
	});

export type TransactionFlowEnumSchema = typeof TransactionFlowEnumSchema;

export namespace TransactionFlowEnumSchema {
	export type Type = z.infer<TransactionFlowEnumSchema>;
}
