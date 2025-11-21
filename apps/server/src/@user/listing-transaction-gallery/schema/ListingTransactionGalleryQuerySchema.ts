import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { ListingTransactionGalleryFilterSchema } from "./ListingTransactionGalleryFilterSchema";
import { ListingTransactionGallerySortSchema } from "./ListingTransactionGallerySortSchema";

export const ListingTransactionGalleryQuerySchema = z
	.object({
		cursor: CursorSchema.optional(),
		filter: ListingTransactionGalleryFilterSchema.optional(),
		where: ListingTransactionGalleryFilterSchema.openapi("ListingTransactionGalleryWhere", {
			description: "App-based filters",
		}).optional(),
		sort: ListingTransactionGallerySortSchema.array().optional(),
	})
	.openapi("ListingTransactionGalleryQuery", {
		description: "Query object for listing transaction gallery",
	});

export type ListingTransactionGalleryQuerySchema = typeof ListingTransactionGalleryQuerySchema;

export namespace ListingTransactionGalleryQuerySchema {
	export type Type = z.infer<ListingTransactionGalleryQuerySchema>;
}
