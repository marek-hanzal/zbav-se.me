import { z } from "@hono/zod-openapi";

export const DraftGalleryTableSchema = z.object({
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

export type DraftGalleryTableSchema = typeof DraftGalleryTableSchema;

export namespace DraftGalleryTableSchema {
	export type Type = z.infer<DraftGalleryTableSchema>;
}
