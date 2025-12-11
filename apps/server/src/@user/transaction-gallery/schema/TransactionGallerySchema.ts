import { z } from "@hono/zod-openapi";
import type { TransactionEventEnumSchema } from "~/app/transaction/schema/ListingTransactionEventEnumSchema";
import { TransactionGalleryDbSchema } from "~/app/transaction-gallery/schema/ListingTransactionGalleryDbSchema";

export const TransactionGallerySchema = z
	.object({
		...TransactionGalleryDbSchema.shape,
		event: z.literal("gallery" satisfies TransactionEventEnumSchema.Type).openapi({
			description: "Event type",
		}),
	})
	.openapi("TransactionGallery", {
		description: "Listing transaction gallery entry",
	});

export type TransactionGallerySchema = typeof TransactionGallerySchema;

export namespace TransactionGallerySchema {
	export type Type = z.infer<TransactionGallerySchema>;
}
