import { z } from "@hono/zod-openapi";

export const FavouriteToggleSchema = z
	.object({
		toggle: z.boolean().openapi({
			description: "Whether to add (true) or remove (false) the listing from favourites",
		}),
		feedId: z.string().openapi({
			description: "Feed this listing belongs to",
		}),
		listingId: z.string().openapi({
			description: "ID of the listing to toggle",
		}),
	})
	.openapi("FavouriteToggle", {
		description: "Data for toggling a listing in favourites",
	});

export type FavouriteToggleSchema = typeof FavouriteToggleSchema;

export namespace FavouriteToggleSchema {
	export type Type = z.infer<FavouriteToggleSchema>;
}
