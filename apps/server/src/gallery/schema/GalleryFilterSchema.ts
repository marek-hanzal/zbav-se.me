import { z } from "@hono/zod-openapi";
import { DefaultFilterSchema } from "../../schema/DefaultFilterSchema";

export const GalleryFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		userId: z.string().nullish().openapi({
			description: "Exact user id",
		}),
		listingId: z.string().nullish().openapi({
			description: "Exact listing id",
		}),
	})
	.openapi("GalleryFilter", {
		description: "User-land filters for gallery items",
	});

export type GalleryFilterSchema = typeof GalleryFilterSchema;

export namespace GalleryFilterSchema {
	export type Type = z.infer<GalleryFilterSchema>;
}
