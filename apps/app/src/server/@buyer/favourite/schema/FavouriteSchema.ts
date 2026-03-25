import { z } from "@hono/zod-openapi";
import { FavouriteTableSchema } from "~/server/database/@table/FavouriteTableSchema";

export const FavouriteSchema = z
	.looseObject({
		...FavouriteTableSchema.shape,
	})
	.omit({
		userId: true,
	})
	.strip()
	.openapi("Favourite", {
		description: "Favourite data",
	});

export type FavouriteSchema = typeof FavouriteSchema;

export namespace FavouriteSchema {
	export type Type = z.infer<FavouriteSchema>;
}
