import { z } from "@hono/zod-openapi";
import { OrderEnumSchema } from "../../../schema/OrderEnumSchema";

export const GalleryItemSortSchema = z
	.object({
		field: z
			.enum([
				"sort",
				"createdAt",
			])
			.openapi("GalleryItemSortField", {
				description: "Field of the gallery item sort",
			}),
		direction: OrderEnumSchema,
	})
	.openapi("GalleryItemSort", {
		description: "Sort object for gallery item collection",
	});

export type GalleryItemSortSchema = typeof GalleryItemSortSchema;

export namespace GalleryItemSortSchema {
	export type Type = z.infer<GalleryItemSortSchema>;
}
