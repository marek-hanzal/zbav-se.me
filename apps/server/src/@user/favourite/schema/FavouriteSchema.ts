import { z } from "@hono/zod-openapi";
import { FavouriteDbSchema } from "~/app/favourite/schema/FavouriteDbSchema";

export const FavouriteSchema = z
	.object({
		...FavouriteDbSchema.shape,
	})
	.omit({
		userId: true,
	})
	.openapi("Favourite", {
		description: "Favourite data",
	});

export type FavouriteSchema = typeof FavouriteSchema;

export namespace FavouriteSchema {
	export type Type = z.infer<FavouriteSchema>;
}
