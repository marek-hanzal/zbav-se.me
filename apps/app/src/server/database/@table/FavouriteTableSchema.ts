import { z } from "zod";

export const FavouriteTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "ID of the favourite item",
		}),
		userId: z.string().meta({
			description: "ID of the user who added the item to favourites",
		}),
		feedId: z.string().meta({
			description: "Feed this listing belongs to",
		}),
		listingId: z.string().meta({
			description: "ID of the listing",
		}),
		createdAt: z.coerce.date().meta({
			description: "Creation timestamp",
			type: "string",
		}),
	})
	.meta({
		id: "FavouriteTable",
		description: "Database row for a favourite listing.",
	})
	.strip();

export type FavouriteTableSchema = typeof FavouriteTableSchema;

export namespace FavouriteTableSchema {
	export type Type = z.infer<FavouriteTableSchema>;
}
