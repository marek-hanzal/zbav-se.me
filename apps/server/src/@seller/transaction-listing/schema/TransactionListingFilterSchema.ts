import { z } from "@hono/zod-openapi";
import { DefaultFilterSchema } from "~/schema/DefaultFilterSchema";

export const TransactionListingFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		active: z.boolean().optional().openapi({
			description:
				"When true, match listings with unread buyer-message inbox activity; when false, match listings without unread buyer-message inbox activity",
		}),
		userId: z.string().optional().openapi({
			description: "This filter matches listings of a specific seller (by userId)",
		}),
	})
	.openapi("TransactionListingFilter", {
		description: "Filter object for transaction-listing collection",
	});

export type TransactionListingFilterSchema = typeof TransactionListingFilterSchema;

export namespace TransactionListingFilterSchema {
	export type Type = z.infer<TransactionListingFilterSchema>;
}
