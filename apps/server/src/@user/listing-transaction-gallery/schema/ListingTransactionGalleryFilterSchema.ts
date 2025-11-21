import { z } from "@hono/zod-openapi";
import { ListingTransactionSideSchema } from "~/app/listing-transaction/schema/ListingTransactionSideSchema";
import { DefaultFilterSchema } from "~/schema/DefaultFilterSchema";

export const ListingTransactionGalleryFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		listingTransactionId: z.string().optional().openapi({
			description: "This filter matches the exact listingTransactionId",
		}),
		galleryId: z.string().optional().openapi({
			description: "This filter matches the exact galleryId",
		}),
		side: ListingTransactionSideSchema.optional(),
	})
	.openapi("ListingTransactionGalleryFilter", {
		description: "Filter object for listing transaction gallery",
	});

export type ListingTransactionGalleryFilterSchema = typeof ListingTransactionGalleryFilterSchema;

export namespace ListingTransactionGalleryFilterSchema {
	export type Type = z.infer<ListingTransactionGalleryFilterSchema>;
}
