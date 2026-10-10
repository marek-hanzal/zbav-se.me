import { z } from "zod";
import { TransactionQuerySchema } from "~/seller-transaction/schema/TransactionQuerySchema";
import { TransactionStatusEnumSchema } from "~/transaction-contract/schema/TransactionStatusEnumSchema";

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
	.meta({
		id: "TransactionPatchCollection",
		description: "Patch transaction items resolved by query",
	});

export type TransactionPatchCollectionSchema = typeof TransactionPatchCollectionSchema;

export namespace TransactionPatchCollectionSchema {
	export type Type = z.infer<TransactionPatchCollectionSchema>;
}
