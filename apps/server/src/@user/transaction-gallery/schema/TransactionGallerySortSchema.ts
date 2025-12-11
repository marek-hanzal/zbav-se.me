import { z } from "@hono/zod-openapi";
import { OrderEnumSchema } from "~/schema/OrderEnumSchema";

export const TransactionGallerySortSchema = z
	.object({
		field: z
			.enum([
				"createdAt",
			])
			.openapi("TransactionGallerySortField", {
				description: "Available sort fields for listing transaction gallery",
			}),
		direction: OrderEnumSchema,
	})
	.openapi("TransactionGallerySort", {
		description: "Sort parameters for listing transaction gallery collection",
	});

export type TransactionGallerySortSchema = typeof TransactionGallerySortSchema;

export namespace TransactionGallerySortSchema {
	export type Type = z.infer<TransactionGallerySortSchema>;
}
