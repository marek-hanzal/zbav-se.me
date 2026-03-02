import { z } from "@hono/zod-openapi";
import { FavouriteFilterSchema } from "~/@buyer/favourite/schema/FavouriteFilterSchema";
import { FavouriteSortSchema } from "~/@buyer/favourite/schema/FavouriteSortSchema";
import { FavouriteWhereSchema } from "~/@buyer/favourite/schema/FavouriteWhereSchema";
import { CursorSchema } from "~/schema/CursorSchema";

export const FavouriteQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: FavouriteFilterSchema.optional(),
		where: FavouriteWhereSchema.optional(),
		sort: FavouriteSortSchema.array().optional(),
	})
	.strip()
	.openapi("FavouriteQuery", {
		description: "Query object for favourite collection",
	});

export type FavouriteQuerySchema = typeof FavouriteQuerySchema;

export namespace FavouriteQuerySchema {
	export type Type = z.infer<FavouriteQuerySchema>;
}
