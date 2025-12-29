import { z } from "@hono/zod-openapi";
import { TransactionDbSchema } from "~/app/transaction/schema/TransactionDbSchema";
import { TransactionQuerySchema } from "~/app/transaction/schema/TransactionQuerySchema";

export const TransactionPatchSchema = z
	.object({
		patch: z
			.object({
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
			.openapi({
				description: "Fields to update (all optional)",
			}),
		query: TransactionQuerySchema,
	})
	.openapi("TransactionPatch", {
		description: "Payload for patching a transaction",
	});

export type TransactionPatchSchema = typeof TransactionPatchSchema;

export namespace TransactionPatchSchema {
	export type Type = z.infer<TransactionPatchSchema>;
}
