import { z } from "zod";
import { ListingFavouriteTableSchema } from "~/database/schema/ListingFavouriteTableSchema";

export const FavouriteSchema = z
	.looseObject({
		...ListingFavouriteTableSchema.shape,
	})
	.omit({
		userId: true,
	})
	.strip()
	.meta({
		id: "Favourite",
		description: "Favourite data",
	});

export type FavouriteSchema = typeof FavouriteSchema;

export namespace FavouriteSchema {
	export type Type = z.infer<FavouriteSchema>;
}
