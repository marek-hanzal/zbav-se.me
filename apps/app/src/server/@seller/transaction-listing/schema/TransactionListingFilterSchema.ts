import { z } from "@hono/zod-openapi";
import { DefaultFilterSchema } from "~/common/schema/DefaultFilterSchema";

export const TransactionListingFilterSchema = z
	.looseObject({
		...DefaultFilterSchema.shape,
		active: z.boolean().optional().openapi({
			description:
				"When true, match listings with unread buyer-message inbox activity; when false, match listings without unread buyer-message inbox activity",
		}),
		terminal: z.boolean().optional().openapi({
			description:
				"When true, match listings whose every transaction is terminal; when false, match listings that still have at least one non-terminal transaction state",
		}),
		userId: z.string().optional().openapi({
			description: "This filter matches listings of a specific seller (by userId)",
		}),
	})
	.strip()
	.openapi("TransactionListingFilter", {
		description: "Filter object for transaction-listing collection",
	});

export type TransactionListingFilterSchema = typeof TransactionListingFilterSchema;

export namespace TransactionListingFilterSchema {
	export type Type = z.infer<TransactionListingFilterSchema>;
}
