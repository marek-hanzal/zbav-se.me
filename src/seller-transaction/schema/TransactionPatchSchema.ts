import { z } from "zod";
import { TransactionTableSchema } from "~/database/schema/TransactionTableSchema";
import { TransactionQuerySchema } from "~/seller-transaction/schema/TransactionQuerySchema";

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
