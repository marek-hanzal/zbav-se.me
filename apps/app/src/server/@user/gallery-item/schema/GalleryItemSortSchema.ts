import { OrderEnumSchema } from "@use-pico/common/schema";
import { z } from "zod";

export const GalleryItemSortSchema = z
	.looseObject({
		field: z
			.enum([
				"sort",
				"createdAt",
			])
			.meta({
				id: "GalleryItemSortField",
				description: "Field of the gallery item sort",
			}),
		order: OrderEnumSchema,
	})
	.strip()
	.meta({
		id: "GalleryItemSort",
		description: "Sort object for gallery item collection",
	});

export type GalleryItemSortSchema = typeof GalleryItemSortSchema;

export namespace GalleryItemSortSchema {
	export type Type = z.infer<GalleryItemSortSchema>;
}
