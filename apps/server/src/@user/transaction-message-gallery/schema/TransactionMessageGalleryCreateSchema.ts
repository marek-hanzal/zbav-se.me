import { z } from "zod";

export const TransactionMessageGalleryCreateSchema = z
	.object({
		transactionId: z.string().openapi({
			description: "The ID of the transaction to add a gallery to",
		}),
		galleryId: z.string().openapi({
			description: "The ID of the gallery",
		}),
	})
	.openapi("TransactionMessageGalleryCreate", {
		description: "Request to create a transaction message gallery",
	});

export type TransactionMessageGalleryCreateSchema = typeof TransactionMessageGalleryCreateSchema;

export namespace TransactionMessageGalleryCreateSchema {
	export type Type = z.infer<TransactionMessageGalleryCreateSchema>;
}
