import { z } from "@hono/zod-openapi";
import type { ListingTransactionEventEnumSchema } from "~/app/listing-transaction/schema/ListingTransactionEventEnumSchema";
import { ListingTransactionGalleryDbSchema } from "~/app/listing-transaction-gallery/schema/ListingTransactionGalleryDbSchema";

export const ListingTransactionGallerySchema = z
	.object({
		...ListingTransactionGalleryDbSchema.shape,
		event: z.literal("gallery" satisfies ListingTransactionEventEnumSchema.Type).openapi({
			description: "Event type",
		}),
	})
	.omit({
		createdAt: true,
	})
	.openapi("ListingTransactionGallery", {
		description: "Listing transaction gallery entry",
	});

export type ListingTransactionGallerySchema = typeof ListingTransactionGallerySchema;

export namespace ListingTransactionGallerySchema {
	export type Type = z.infer<ListingTransactionGallerySchema>;
}
