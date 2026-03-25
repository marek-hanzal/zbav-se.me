import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/common/schema/CursorSchema";
import { FavouriteFilterSchema } from "~/server/@buyer/favourite/schema/FavouriteFilterSchema";
import { FavouriteSortSchema } from "~/server/@buyer/favourite/schema/FavouriteSortSchema";
import { FavouriteWhereSchema } from "~/server/@buyer/favourite/schema/FavouriteWhereSchema";

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
