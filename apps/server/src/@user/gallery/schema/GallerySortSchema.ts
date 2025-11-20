import { z } from "@hono/zod-openapi";
import { OrderSchema } from "../../../schema/OrderSchema";

export const GallerySortSchema = z
	.object({
		field: z
			.enum([
				"sort",
				"createdAt",
			])
			.openapi("GallerySortField", {
				description: "Field of the gallery sort",
			}),
		direction: OrderSchema,
	})
	.openapi("GallerySort", {
		description: "Sort object for gallery collection",
	});

export type GallerySortSchema = typeof GallerySortSchema;

export namespace GallerySortSchema {
	export type Type = z.infer<GallerySortSchema>;
}
