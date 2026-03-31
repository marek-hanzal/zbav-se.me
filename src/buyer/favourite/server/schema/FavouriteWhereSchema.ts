import { z } from "zod";
import { FavouriteFilterSchema } from "~/buyer/favourite/server/schema/FavouriteFilterSchema";

export const FavouriteWhereSchema = z
	.looseObject({
		...FavouriteFilterSchema.shape,
	})
	.strip()
	.meta({
		id: "FavouriteWhere",
		description: "App-based filters",
	});

export type FavouriteWhereSchema = typeof FavouriteWhereSchema;

export namespace FavouriteWhereSchema {
	export type Type = z.infer<FavouriteWhereSchema>;
}
