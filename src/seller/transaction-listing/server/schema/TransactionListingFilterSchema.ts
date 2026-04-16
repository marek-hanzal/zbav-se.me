import { z } from "zod";
import { FilterSchema } from "@/lib/common/schema";
import { TransactionListingFlowEnumSchema } from "~/seller/transaction-listing/server/enum/TransactionListingFlowEnumSchema";

export const TransactionListingFilterSchema = z
	.looseObject({
		...FilterSchema.shape,
		active: z
			.boolean()
			.optional()
			.meta({
				description: `
When true, match listings with unread buyer-message activity activity; when false, match listings without unread
buyer-message activity activity
                `.trim(),
			}),
		terminal: z
			.boolean()
			.optional()
			.meta({
				description: `
When true, match listings whose every transaction is terminal; when false, match listings that still have at least one
non-terminal transaction state
                `.trim(),
			}),
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
