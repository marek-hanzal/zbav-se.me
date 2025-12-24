import { z } from "zod";

export const TransactionMessageGalleryCreateSchema = z
	.object({
		messageThreadId: z.string().openapi({
			description: "The ID of the message thread to add a gallery to",
		}),
		uploadIds: z.array(z.string()).min(1, "At least one upload is required").openapi({
			description: "IDs of the uploads; order of uploads defines order in the gallery",
		}),
	})
	.openapi("TransactionMessageGalleryCreate", {
		description: "Request to create a transaction message gallery",
	});

export type TransactionMessageGalleryCreateSchema = typeof TransactionMessageGalleryCreateSchema;

export namespace TransactionMessageGalleryCreateSchema {
	export type Type = z.infer<TransactionMessageGalleryCreateSchema>;
}
