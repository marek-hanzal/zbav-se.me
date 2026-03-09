import { z } from "@hono/zod-openapi";

export const TransactionEntryGalleryValueSchema = z
	.looseObject({
		galleryId: z.string().openapi({
			description: "Gallery identifier linked to this entry",
		}),
	})
	.openapi("TransactionEntryGalleryValue");

export type TransactionEntryGalleryValueSchema = typeof TransactionEntryGalleryValueSchema;

export namespace TransactionEntryGalleryValueSchema {
	export type Type = z.infer<TransactionEntryGalleryValueSchema>;
}
