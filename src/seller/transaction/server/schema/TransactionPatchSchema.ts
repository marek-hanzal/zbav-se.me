import { z } from "zod";
import { TransactionQuerySchema } from "~/seller/transaction/server/schema/TransactionQuerySchema";
import { TransactionTableSchema } from "~/server/database/@table/TransactionTableSchema";

export const TransactionPatchSchema = z
	.looseObject({
		patch: z
			.looseObject({
				...TransactionTableSchema.shape,
			})
			.omit({
				id: true,
				userId: true,
				listingId: true,
				createdAt: true,
				updatedAt: true,
				expiresAt: true,
			})
			.partial()
			.strip()
			.meta({
				description: "Fields to update (all optional)",
			}),
		query: TransactionQuerySchema,
	})
	.strip()
	.meta({
		id: "TransactionPatch",
		description: "Payload for patching a transaction",
	});

export type TransactionPatchSchema = typeof TransactionPatchSchema;

export namespace TransactionPatchSchema {
	export type Type = z.infer<TransactionPatchSchema>;
}
