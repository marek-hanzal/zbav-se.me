import { z } from "@hono/zod-openapi";
import { FavouriteDbSchema } from "~/app/favourite/schema/FavouriteDbSchema";

export const FavouriteSchema = z
	.looseObject({
		...FavouriteDbSchema.shape,
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
