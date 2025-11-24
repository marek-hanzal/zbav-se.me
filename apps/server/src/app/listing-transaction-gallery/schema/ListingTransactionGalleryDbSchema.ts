import { z } from "@hono/zod-openapi";
import { ListingTransactionSideEnumSchema } from "~/app/listing-transaction/schema/ListingTransactionSideEnumSchema";

export const ListingTransactionGalleryDbSchema = z.object({
	id: z.string().openapi({
		description: "ID of the transaction gallery entry",
	}),
	listingTransactionId: z.string().openapi({
		description: "ID of the transaction referenced by the gallery",
	}),
	side: ListingTransactionSideEnumSchema,
	galleryId: z.string().openapi({
		description: "ID of the gallery",
	}),
	createdAt: z.coerce.date().openapi({
		description: "Creation timestamp",
		type: "string",
	}),
});

export type ListingTransactionGalleryDbSchema = typeof ListingTransactionGalleryDbSchema;

export namespace ListingTransactionGalleryDbSchema {
	export type Type = z.infer<ListingTransactionGalleryDbSchema>;
}
