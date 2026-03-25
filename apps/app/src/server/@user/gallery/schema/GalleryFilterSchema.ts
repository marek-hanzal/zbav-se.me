import { z } from "@hono/zod-openapi";
import { DefaultFilterSchema } from "~/common/schema/DefaultFilterSchema";

export const GalleryFilterSchema = z
	.looseObject({
		...DefaultFilterSchema.shape,
		userId: z.string().optional().openapi({
			description: "Exact user id",
		}),
	})
	.strip()
	.openapi("GalleryFilter", {
		description: "Filter object for gallery collection",
	});

export type GalleryFilterSchema = typeof GalleryFilterSchema;

export namespace GalleryFilterSchema {
	export type Type = z.infer<GalleryFilterSchema>;
}
