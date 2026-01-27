import { z } from "@hono/zod-openapi";
import { CountEnumSchema } from "@use-pico/common/schema";
import { GalleryItemQuerySchema } from "./GalleryItemQuerySchema";

export const GalleryItemCountQuerySchema = z
	.looseObject({
		...GalleryItemQuerySchema.pick({
			filter: true,
			where: true,
		}).shape,
		count: CountEnumSchema.array().optional(),
	})
	.strip()
	.openapi("GalleryItemCountQuery", {
		description: "Query object for gallery item count",
	});

export type GalleryItemCountQuerySchema = typeof GalleryItemCountQuerySchema;

export namespace GalleryItemCountQuerySchema {
	export type Type = z.infer<GalleryItemCountQuerySchema>;
}
