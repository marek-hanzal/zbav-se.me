import { z } from "@hono/zod-openapi";
import { TransactionQuerySchema } from "~/server/@buyer/transaction/schema/TransactionQuerySchema";
import { TransactionStatusEnumSchema } from "~/server/database/@enum/TransactionStatusEnumSchema";

export const TransactionPatchCollectionSchema = z
	.looseObject({
		patch: z
			.looseObject({
				status: TransactionStatusEnumSchema.optional(),
			})
			.strip(),
		query: TransactionQuerySchema,
	})
	.strip()
	.openapi("TransactionPatchCollection", {
		description: "Patch transaction items resolved by query",
	});

export type TransactionPatchCollectionSchema = typeof TransactionPatchCollectionSchema;

export namespace TransactionPatchCollectionSchema {
	export type Type = z.infer<TransactionPatchCollectionSchema>;
}
