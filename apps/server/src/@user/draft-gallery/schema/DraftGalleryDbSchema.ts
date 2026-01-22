import { z } from "@hono/zod-openapi";

export const DraftGalleryDbSchema = z.object({
	id: z.string().openapi({
		description: "ID of the draft-gallery relationship",
	}),
	draftId: z.string().openapi({
		description: "ID of the draft",
	}),
	galleryId: z.string().openapi({
		description: "ID of the gallery",
	}),
	createdAt: z.coerce.date().openapi({
		description: "Creation timestamp",
		type: "string",
	}),
});

export type DraftGalleryDbSchema = typeof DraftGalleryDbSchema;

export namespace DraftGalleryDbSchema {
	export type Type = z.infer<DraftGalleryDbSchema>;
}
