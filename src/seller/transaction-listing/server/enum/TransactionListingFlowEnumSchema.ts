import { z } from "zod";

export const TransactionListingFlowEnumSchema = z
	.enum([
		/**
		 * Fetch all transactions which needs seller's attention
		 */
		"attention",
		/**
		 * Fetch all transactions which are active, but they don't need attention
		 * for now
		 */
		"resolved",
		/**
		 * Archived transactions already done (closed - archived)
		 */
		"archived",
	])
	.meta({
		id: "TransactionListingFlowEnum",
		description:
			"Used to filter out part of trade/attention flow - transactions with attention, resolved and archived",
	});

export type TransactionListingFlowEnumSchema = typeof TransactionListingFlowEnumSchema;

export namespace TransactionFlowEnumSchema {
	export type Type = z.infer<TransactionListingFlowEnumSchema>;
}
