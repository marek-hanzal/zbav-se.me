import { z } from "@hono/zod-openapi";
import { DefaultFilterSchema } from "~/schema/DefaultFilterSchema";

export const GalleryItemFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		userId: z.string().optional().openapi({
			description: "Exact user id (access checked via parent gallery)",
		}),
		galleryId: z.string().optional().openapi({
			description: "Exact gallery id",
		}),
	})
	.openapi("GalleryItemFilter", {
		description: "Filter object for gallery item collection",
	});

export type GalleryItemFilterSchema = typeof GalleryItemFilterSchema;

export namespace GalleryItemFilterSchema {
	export type Type = z.infer<GalleryItemFilterSchema>;
}
