import { z } from "@hono/zod-openapi";
import { DefaultFilterSchema } from "~/schema/DefaultFilterSchema";

export const DraftGalleryFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		draftId: z.string().optional().openapi({
			description: "This filter matches the exact draftId",
		}),
		galleryId: z.string().optional().openapi({
			description: "This filter matches the exact galleryId",
		}),
	})
	.openapi("DraftGalleryFilter", {
		description: "Filter object for draft gallery",
	});

export type DraftGalleryFilterSchema = typeof DraftGalleryFilterSchema;

export namespace DraftGalleryFilterSchema {
	export type Type = z.infer<DraftGalleryFilterSchema>;
}
