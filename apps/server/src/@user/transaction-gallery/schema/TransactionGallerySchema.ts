import { z } from "@hono/zod-openapi";
import { GallerySchema } from "~/@user/gallery/schema/GallerySchema";
import type { TransactionEventEnumSchema } from "~/app/transaction/schema/TransactionEventEnumSchema";
import { TransactionGalleryDbSchema } from "~/app/transaction-gallery/schema/TransactionGalleryDbSchema";

export const TransactionGallerySchema = z
	.object({
		...TransactionGalleryDbSchema.shape,
		event: z.literal("gallery" satisfies TransactionEventEnumSchema.Type).openapi({
			description: "Event type",
		}),
		gallery: GallerySchema,
	})
	.openapi("TransactionGallery", {
		description: "Listing transaction gallery entry",
	});

export type TransactionGallerySchema = typeof TransactionGallerySchema;

export namespace TransactionGallerySchema {
	export type Type = z.infer<TransactionGallerySchema>;
}
