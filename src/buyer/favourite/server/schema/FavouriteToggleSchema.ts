import { z } from "zod";

export const FavouriteToggleSchema = z
	.looseObject({
		toggle: z.boolean().meta({
			description: "Whether to add (true) or remove (false) the listing from favourites",
		}),
		feedId: z.string().meta({
			description: "Feed this listing belongs to",
		}),
		listingId: z.string().meta({
			description: "ID of the listing to toggle",
		}),
	})
	.strip()
	.meta({
		id: "FavouriteToggle",
		description: "Data for toggling a listing in favourites",
	});

export type FavouriteToggleSchema = typeof FavouriteToggleSchema;

export namespace FavouriteToggleSchema {
	export type Type = z.infer<FavouriteToggleSchema>;
}
