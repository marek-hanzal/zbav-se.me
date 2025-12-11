import { z } from "zod";

export const TransactionGalleryCreateSchema = z
	.object({
		messageThreadId: z.string().openapi({
			description: "The ID of the listing transaction to add a gallery to",
		}),
		uploadIds: z.array(z.string()).min(1, "At least one upload is required").openapi({
			description: "IDs of the uploads; order of uploads defines order in the gallery",
		}),
	})
	.openapi("TransactionGalleryCreate", {
		description: "Request to create a listing transaction gallery",
	});

export type TransactionGalleryCreateSchema = typeof TransactionGalleryCreateSchema;

export namespace TransactionGalleryCreateSchema {
	export type Type = z.infer<TransactionGalleryCreateSchema>;
}
