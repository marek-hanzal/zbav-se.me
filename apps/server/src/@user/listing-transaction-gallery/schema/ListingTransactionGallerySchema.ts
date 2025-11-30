import { z } from "@hono/zod-openapi";
import { GallerySchema } from "~/@user/gallery/schema/GallerySchema";
import type { ListingTransactionEventEnumSchema } from "~/app/listing-transaction/schema/ListingTransactionEventEnumSchema";
import { ListingTransactionGalleryDbSchema } from "~/app/listing-transaction-gallery/schema/ListingTransactionGalleryDbSchema";

export const ListingTransactionGallerySchema = z
	.object({
		...ListingTransactionGalleryDbSchema.shape,
		event: z.literal("gallery" satisfies ListingTransactionEventEnumSchema.Type).openapi({
			description: "Event type",
		}),
		gallery: GallerySchema,
	})
	.openapi("ListingTransactionGallery", {
		description: "Listing transaction gallery entry",
	});

export type ListingTransactionGallerySchema = typeof ListingTransactionGallerySchema;

export namespace ListingTransactionGallerySchema {
	export type Type = z.infer<ListingTransactionGallerySchema>;
}
