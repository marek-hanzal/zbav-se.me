import { z } from "@hono/zod-openapi";
import { TransactionSideEnumSchema } from "~/app/transaction/schema/ListingTransactionSideEnumSchema";
import { TransactionStatusEnumSchema } from "~/app/transaction/schema/ListingTransactionStatusEnumSchema";
import { DefaultFilterSchema } from "~/schema/DefaultFilterSchema";

export const TransactionStatusFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		transactionId: z.string().optional().openapi({
			description: "This filter matches the exact transactionId",
		}),
		status: TransactionStatusEnumSchema.optional(),
		statusIn: TransactionStatusEnumSchema.array().optional(),
		side: TransactionSideEnumSchema.optional(),
	})
	.openapi("TransactionStatusFilter", {
		description: "Filter object for listing transaction status",
	});

export type TransactionStatusFilterSchema = typeof TransactionStatusFilterSchema;

export namespace TransactionStatusFilterSchema {
	export type Type = z.infer<TransactionStatusFilterSchema>;
}
