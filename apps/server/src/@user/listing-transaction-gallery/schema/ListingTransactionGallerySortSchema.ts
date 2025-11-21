import { z } from "@hono/zod-openapi";
import { OrderSchema } from "~/schema/OrderSchema";

export const ListingTransactionGallerySortSchema = z
	.object({
		field: z
			.enum([
				"createdAt",
			])
			.openapi("ListingTransactionGallerySortField", {
				description: "Available sort fields for listing transaction gallery",
			}),
		direction: OrderSchema,
	})
	.openapi("ListingTransactionGallerySort", {
		description: "Sort parameters for listing transaction gallery collection",
	});

export type ListingTransactionGallerySortSchema = typeof ListingTransactionGallerySortSchema;

export namespace ListingTransactionGallerySortSchema {
	export type Type = z.infer<ListingTransactionGallerySortSchema>;
}
