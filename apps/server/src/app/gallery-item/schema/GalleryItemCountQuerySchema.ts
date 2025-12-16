import type { z } from "@hono/zod-openapi";
import { GalleryItemQuerySchema } from "./GalleryItemQuerySchema";

export const GalleryItemCountQuerySchema = GalleryItemQuerySchema.pick({
	filter: true,
	where: true,
}).openapi("GalleryItemCountQuery", {
	description: "Query object for gallery item count",
});

export type GalleryItemCountQuerySchema = typeof GalleryItemCountQuerySchema;

export namespace GalleryItemCountQuerySchema {
	export type Type = z.infer<GalleryItemCountQuerySchema>;
}
