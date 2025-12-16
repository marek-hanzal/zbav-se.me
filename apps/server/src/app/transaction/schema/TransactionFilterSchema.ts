import { z } from "@hono/zod-openapi";
import { TransactionStatusEnumSchema } from "~/app/transaction/schema/ListingTransactionStatusEnumSchema";
import { DefaultFilterSchema } from "~/schema/DefaultFilterSchema";

export const TransactionFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		userId: z.string().optional().openapi({
			description: "This filter matches the exact userId",
		}),
		listingId: z.string().optional().openapi({
			description: "This filter matches the exact listingId",
		}),
		status: TransactionStatusEnumSchema.optional().openapi({
			description: "This filter matches the current status of the transaction",
		}),
		statusIn: z.array(TransactionStatusEnumSchema).optional().openapi({
			description:
				"This filter matches any of the provided statuses for the current status of the transaction",
		}),
	})
	.openapi("TransactionFilter", {
		description: "Filter object for transaction collection",
	});

export type TransactionFilterSchema = typeof TransactionFilterSchema;

export namespace TransactionFilterSchema {
	export type Type = z.infer<TransactionFilterSchema>;
}
