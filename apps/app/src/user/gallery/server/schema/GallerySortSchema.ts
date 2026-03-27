import { OrderEnumSchema } from "@use-pico/common/schema";
import { z } from "zod";

export const GallerySortSchema = z
	.object({
		field: z
			.enum([
				"createdAt",
			])
			.meta({
				id: "GallerySortField",
				description: "Field of the gallery sort",
			}),
		order: OrderEnumSchema,
	})
	.meta({
		id: "GallerySort",
		description: "Sort object for gallery collection",
	});

export type GallerySortSchema = typeof GallerySortSchema;

export namespace GallerySortSchema {
	export type Type = z.infer<GallerySortSchema>;
}
