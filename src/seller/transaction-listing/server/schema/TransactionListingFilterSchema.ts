import { z } from "zod";
import { FilterSchema } from "@/lib/common/schema";
import { TransactionListingFlowEnumSchema } from "~/seller/transaction-listing/server/enum/TransactionListingFlowEnumSchema";

export const TransactionListingFilterSchema = z
	.looseObject({
		...FilterSchema.shape,
		flow: TransactionListingFlowEnumSchema.optional(),
		userId: z.string().optional().meta({
			description: "This filter matches listings of a specific seller (by userId)",
		}),
	})
	.strip()
	.meta({
		id: "TransactionListingFilter",
		description: "Filter object for transaction-listing collection",
	});

export type TransactionListingFilterSchema = typeof TransactionListingFilterSchema;

export namespace TransactionListingFilterSchema {
	export type Type = z.infer<TransactionListingFilterSchema>;
}
