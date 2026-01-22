import { z } from "@hono/zod-openapi";
import { CountEnumSchema } from "@use-pico/common/schema";
import { GalleryQuerySchema } from "./GalleryQuerySchema";

export const GalleryCountQuerySchema = z
	.looseObject({
		...GalleryQuerySchema.pick({
			filter: true,
			where: true,
		}).shape,
		count: CountEnumSchema.array().optional(),
	})
	.strip()
	.openapi("GalleryCountQuery", {
		description: "Query object for gallery count",
	});

export type GalleryCountQuerySchema = typeof GalleryCountQuerySchema;

export namespace GalleryCountQuerySchema {
	export type Type = z.infer<GalleryCountQuerySchema>;
}
