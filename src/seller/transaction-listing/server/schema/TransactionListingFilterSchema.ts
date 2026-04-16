import { z } from "zod";
import { FilterSchema } from "@/lib/common/schema";
import { TransactionFlowEnumSchema } from "~/common/user-transaction/enum/TransactionFlowEnumSchema";

export const TransactionListingFilterSchema = z
	.looseObject({
		...FilterSchema.shape,
		flow: TransactionFlowEnumSchema.optional(),
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
