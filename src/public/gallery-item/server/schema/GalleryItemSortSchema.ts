import { z } from "zod";
import { OrderEnumSchema } from "@/lib/common/schema";

export const GalleryItemSortSchema = z
	.looseObject({
		field: z
			.enum([
				"sort",
				"createdAt",
			])
			.meta({
				id: "PublicGalleryItemSortField",
				description: "Field of the public gallery item sort",
			}),
		order: OrderEnumSchema,
	})
	.strip()
	.meta({
		id: "PublicGalleryItemSort",
		description: "Sort object for public gallery item collection",
	});

export type GalleryItemSortSchema = typeof GalleryItemSortSchema;

export namespace GalleryItemSortSchema {
	export type Type = z.infer<GalleryItemSortSchema>;
}
