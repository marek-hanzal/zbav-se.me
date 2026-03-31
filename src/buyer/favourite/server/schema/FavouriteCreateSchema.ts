import { z } from "zod";

export const FavouriteCreateSchema = z
	.looseObject({
		feedId: z.string().meta({
			description: "Feed this listing belongs to",
		}),
		listingId: z.string().meta({
			description: "ID of the listing",
		}),
	})
	.strip()
	.meta({
		id: "FavouriteCreate",
		description: "Favourite create schema",
	});

export type FavouriteCreateSchema = typeof FavouriteCreateSchema;

export namespace FavouriteCreateSchema {
	export type Type = z.infer<FavouriteCreateSchema>;
}
