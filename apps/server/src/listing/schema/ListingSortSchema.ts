import { z } from "@hono/zod-openapi";
import { ListingCommonSortSchema } from "./ListingCommonSortSchema";
import { ListingGeoSortSchema } from "./ListingGeoSortSchema";

export const ListingSortSchema = z
	.union([
		ListingCommonSortSchema,
		ListingGeoSortSchema,
	])
	.openapi("ListingSort", {
		description: "Sort object for listing collection",
	});

export type ListingSortSchema = typeof ListingSortSchema;

export namespace ListingSortSchema {
	export type Type = z.infer<ListingSortSchema>;
}
