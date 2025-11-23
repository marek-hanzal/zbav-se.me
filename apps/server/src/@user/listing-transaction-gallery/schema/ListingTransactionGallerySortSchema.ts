import { z } from "@hono/zod-openapi";
import { OrderEnumSchema } from "~/schema/OrderEnumSchema";

export const ListingTransactionGallerySortSchema = z
	.object({
		field: z
			.enum([
				"createdAt",
			])
			.openapi("ListingTransactionGallerySortField", {
				description: "Available sort fields for listing transaction gallery",
			}),
		direction: OrderEnumSchema,
	})
	.openapi("ListingTransactionGallerySort", {
		description: "Sort parameters for listing transaction gallery collection",
	});

export type ListingTransactionGallerySortSchema = typeof ListingTransactionGallerySortSchema;

export namespace ListingTransactionGallerySortSchema {
	export type Type = z.infer<ListingTransactionGallerySortSchema>;
}
