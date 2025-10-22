import { z } from "@hono/zod-openapi";

export const GallerySchema = z
	.object({
		id: z.string().openapi({
			description: "ID of the gallery item",
		}),
		userId: z.string().openapi({
			description: "ID of the user who owns the gallery item",
		}),
		listingId: z.string().openapi({
			description: "ID of the listing this image belongs to",
		}),
		url: z.string().url().openapi({
			description: "Public URL to the image",
		}),
		sort: z.number().openapi({
			description: "Sort order of the image in the listing's gallery",
		}),
		createdAt: z.coerce.date().openapi({
			description: "Creation timestamp",
			type: "string",
		}),
		updatedAt: z.coerce.date().openapi({
			description: "Last update timestamp",
			type: "string",
		}),
	})
	.openapi("Gallery", {
		description: "Represents a photo in a listing's gallery",
	});

export type GallerySchema = typeof GallerySchema;

export namespace GallerySchema {
	export type Type = z.infer<typeof GallerySchema>;
}
