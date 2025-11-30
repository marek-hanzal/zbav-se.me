import { z } from "zod";

export const ListingTransactionGalleryCreateSchema = z
	.object({
		listingTransactionId: z.string().openapi({
			description: "The ID of the listing transaction to add a gallery to",
		}),
		uploadIds: z.array(z.string()).min(1, "At least one upload is required").openapi({
			description: "IDs of the uploads; order of uploads defines order in the gallery",
		}),
	})
	.openapi("ListingTransactionGalleryCreate", {
		description: "Request to create a listing transaction gallery",
	});

export type ListingTransactionGalleryCreateSchema = typeof ListingTransactionGalleryCreateSchema;

export namespace ListingTransactionGalleryCreateSchema {
	export type Type = z.infer<ListingTransactionGalleryCreateSchema>;
}
