import { z } from "@hono/zod-openapi";

export const FeedGalleryCreateSchema = z
	.object({
		feedId: z.string().openapi({
			description: "The ID of the feed to add a gallery to",
		}),
		uploadIds: z.array(z.string()).min(1, "At least one upload is required").openapi({
			description: "IDs of the uploads; order of uploads defines order in the gallery",
		}),
	})
	.openapi("FeedGalleryCreate", {
		description: "Request to create or update a feed gallery",
	});

export type FeedGalleryCreateSchema = typeof FeedGalleryCreateSchema;

export namespace FeedGalleryCreateSchema {
	export type Type = z.infer<FeedGalleryCreateSchema>;
}
