import { z } from "@hono/zod-openapi";
import { ListingTransactionEventSchema } from "~/app/listing-transaction/schema/ListingTransactionEventSchema";
import { ListingTransactionSideSchema } from "~/app/listing-transaction/schema/ListingTransactionSideSchema";

export const ListingTransactionGalleryDbSchema = z.object({
	id: z.string().openapi({
		description: "ID of the transaction gallery entry",
	}),
	listingTransactionId: z.string().openapi({
		description: "ID of the transaction referenced by the gallery",
	}),
	event: ListingTransactionEventSchema,
	side: ListingTransactionSideSchema,
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
