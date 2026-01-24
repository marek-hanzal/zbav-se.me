import { z } from "@hono/zod-openapi";
import { TransactionDbSchema } from "~/@user/transaction/schema/TransactionDbSchema";
import { TransactionQuerySchema } from "~/@user/transaction/schema/TransactionQuerySchema";

export const TransactionPatchSchema = z
	.looseObject({
		patch: z
			.looseObject({
				...TransactionDbSchema.shape,
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
			.openapi({
				description: "Fields to update (all optional)",
			}),
		query: TransactionQuerySchema,
	})
	.strip()
	.openapi("TransactionPatch", {
		description: "Payload for patching a transaction",
	});

export type TransactionPatchSchema = typeof TransactionPatchSchema;

export namespace TransactionPatchSchema {
	export type Type = z.infer<TransactionPatchSchema>;
}
