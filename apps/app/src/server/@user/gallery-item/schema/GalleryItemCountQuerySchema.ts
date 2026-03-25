import { z } from "@hono/zod-openapi";
import { GalleryItemQuerySchema } from "~/server/@user/gallery-item/schema/GalleryItemQuerySchema";

export const GalleryItemCountQuerySchema = z
	.looseObject({
		...GalleryItemQuerySchema.pick({
			filter: true,
			where: true,
		}).shape,
	})
	.strip()
	.openapi("GalleryItemCountQuery", {
		description: "Query object for gallery item count",
	});

export type GalleryItemCountQuerySchema = typeof GalleryItemCountQuerySchema;

export namespace GalleryItemCountQuerySchema {
	export type Type = z.infer<GalleryItemCountQuerySchema>;
}
