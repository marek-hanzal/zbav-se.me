import { z } from "@hono/zod-openapi";
import { OrderEnumSchema } from "~/common/schema/OrderEnumSchema";

export const GalleryItemSortSchema = z
	.looseObject({
		field: z
			.enum([
				"sort",
				"createdAt",
			])
			.openapi("GalleryItemSortField", {
				description: "Field of the gallery item sort",
			}),
		order: OrderEnumSchema,
	})
	.strip()
	.openapi("GalleryItemSort", {
		description: "Sort object for gallery item collection",
	});

export type GalleryItemSortSchema = typeof GalleryItemSortSchema;

export namespace GalleryItemSortSchema {
	export type Type = z.infer<GalleryItemSortSchema>;
}
