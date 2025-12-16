import type { z } from "@hono/zod-openapi";
import { GalleryQuerySchema } from "./GalleryQuerySchema";

export const GalleryCountQuerySchema = GalleryQuerySchema.pick({
	filter: true,
	where: true,
}).openapi("GalleryCountQuery", {
	description: "Query object for gallery count",
});

export type GalleryCountQuerySchema = typeof GalleryCountQuerySchema;

export namespace GalleryCountQuerySchema {
	export type Type = z.infer<GalleryCountQuerySchema>;
}
