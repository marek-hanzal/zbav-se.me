import { z } from "@hono/zod-openapi";
import { FavouriteFilterSchema } from "~/server/@buyer/favourite/schema/FavouriteFilterSchema";

export const FavouriteWhereSchema = z
	.looseObject({
		...FavouriteFilterSchema.shape,
	})
	.strip()
	.openapi("FavouriteWhere", {
		description: "App-based filters",
	});

export type FavouriteWhereSchema = typeof FavouriteWhereSchema;

export namespace FavouriteWhereSchema {
	export type Type = z.infer<FavouriteWhereSchema>;
}
