import { z } from "@hono/zod-openapi";
import { OrderEnumSchema } from "~/common/schema/OrderEnumSchema";

export const GallerySortSchema = z
	.object({
		field: z
			.enum([
				"createdAt",
			])
			.openapi("GallerySortField", {
				description: "Field of the gallery sort",
			}),
		order: OrderEnumSchema,
	})
	.openapi("GallerySort", {
		description: "Sort object for gallery collection",
	});

export type GallerySortSchema = typeof GallerySortSchema;

export namespace GallerySortSchema {
	export type Type = z.infer<GallerySortSchema>;
}
