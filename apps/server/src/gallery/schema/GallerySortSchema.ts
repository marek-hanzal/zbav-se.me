import { z } from "@hono/zod-openapi";
import { OrderSchema } from "@use-pico/common";

export const GallerySortSchema = z
	.object({
		value: z.enum([
			"sort",
			"createdAt",
		]),
		sort: OrderSchema,
	})
	.openapi("GallerySort", {
		description: "Sort object for gallery collection",
	});

export type GallerySortSchema = typeof GallerySortSchema;

export namespace GallerySortSchema {
	export type Type = z.infer<GallerySortSchema>;
}
