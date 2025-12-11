import { z } from "@hono/zod-openapi";
import { TransactionSideEnumSchema } from "~/app/transaction/schema/ListingTransactionSideEnumSchema";

export const TransactionGalleryDbSchema = z.object({
	id: z.string().openapi({
		description: "ID of the transaction gallery entry",
	}),
	messageThreadId: z.string().openapi({
		description: "ID of the transaction referenced by the gallery",
	}),
	side: TransactionSideEnumSchema,
	galleryId: z.string().openapi({
		description: "ID of the gallery",
	}),
	createdAt: z.coerce.date().openapi({
		description: "Creation timestamp",
		type: "string",
	}),
});

export type TransactionGalleryDbSchema = typeof TransactionGalleryDbSchema;

export namespace TransactionGalleryDbSchema {
	export type Type = z.infer<TransactionGalleryDbSchema>;
}
