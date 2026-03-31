import { z } from "zod";
import { FavouriteTableSchema } from "~/server/database/@table/FavouriteTableSchema";

export const FavouriteSchema = z
	.looseObject({
		...FavouriteTableSchema.shape,
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
