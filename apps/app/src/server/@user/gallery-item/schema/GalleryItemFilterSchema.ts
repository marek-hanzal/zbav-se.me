import { z } from "@hono/zod-openapi";
import { DefaultFilterSchema } from "~/common/schema/DefaultFilterSchema";

export const GalleryItemFilterSchema = z
	.looseObject({
		...DefaultFilterSchema.shape,
		userId: z.string().optional().openapi({
			description: "Exact user id (access checked via parent gallery)",
		}),
		galleryId: z.string().optional().openapi({
			description: "Exact gallery id",
		}),
	})
	.strip()
	.openapi("GalleryItemFilter", {
		description: "Filter object for gallery item collection",
	});

export type GalleryItemFilterSchema = typeof GalleryItemFilterSchema;

export namespace GalleryItemFilterSchema {
	export type Type = z.infer<GalleryItemFilterSchema>;
}
