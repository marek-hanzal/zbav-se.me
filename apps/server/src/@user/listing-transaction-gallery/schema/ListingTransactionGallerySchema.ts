import { z } from "@hono/zod-openapi";
import { ListingTransactionGalleryDbSchema } from "~/app/listing-transaction-gallery/schema/ListingTransactionGalleryDbSchema";

export const ListingTransactionGallerySchema = z
	.object({
		...ListingTransactionGalleryDbSchema.shape,
	})
	.openapi("ListingTransactionGallery", {
		description: "Listing transaction gallery entry",
	})
	.omit({
		createdAt: true,
	});

export type ListingTransactionGallerySchema = typeof ListingTransactionGallerySchema;

export namespace ListingTransactionGallerySchema {
	export type Type = z.infer<ListingTransactionGallerySchema>;
}
