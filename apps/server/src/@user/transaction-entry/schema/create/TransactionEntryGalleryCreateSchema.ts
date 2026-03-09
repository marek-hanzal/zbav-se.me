import { z } from "@hono/zod-openapi";

export const TransactionEntryGalleryCreateSchema = z
	.looseObject({
		transactionId: z.string().openapi({
			description: "Transaction identifier",
		}),
		kind: z.literal("gallery"),
		payload: z.looseObject({
			uploadIds: z.array(z.string()).min(1).openapi({
				description: "Ordered uploads used to build the gallery entry",
			}),
		}),
	})
	.openapi("TransactionEntryGalleryCreate");

export type TransactionEntryGalleryCreateSchema = typeof TransactionEntryGalleryCreateSchema;

export namespace TransactionEntryGalleryCreateSchema {
	export type Type = z.infer<TransactionEntryGalleryCreateSchema>;
}
