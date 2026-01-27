import { z } from "@hono/zod-openapi";
import { TransactionQuerySchema } from "~/@buyer-user/transaction/schema/TransactionQuerySchema";
import { TransactionTableSchema } from "~/database/@table/TransactionTableSchema";

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
