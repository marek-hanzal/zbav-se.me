import { z } from "@hono/zod-openapi";
import { DefaultFilterSchema } from "~/schema/DefaultFilterSchema";

export const TransactionListingFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
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
