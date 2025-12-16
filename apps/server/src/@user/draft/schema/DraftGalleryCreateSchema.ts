import { z } from "zod";

export const DraftGalleryCreateSchema = z
	.object({
		draftId: z.string().openapi({
			description: "The ID of the draft to add a gallery to",
		}),
		uploadIds: z.array(z.string()).min(1, "At least one upload is required").openapi({
			description: "IDs of the uploads; order of uploads defines order in the gallery",
		}),
	})
	.openapi("DraftGalleryCreate", {
		description: "Request to create or update a draft gallery",
	});

export type DraftGalleryCreateSchema = typeof DraftGalleryCreateSchema;

export namespace DraftGalleryCreateSchema {
	export type Type = z.infer<DraftGalleryCreateSchema>;
}
