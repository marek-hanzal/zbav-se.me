import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { FavouriteFilterSchema } from "./FavouriteFilterSchema";
import { FavouriteSortSchema } from "./FavouriteSortSchema";

export const FavouriteQuerySchema = z
	.object({
		cursor: CursorSchema.optional(),
		filter: FavouriteFilterSchema.optional(),
		where: FavouriteFilterSchema.openapi("FavouriteWhere", {
			description: "App-based filters",
		}).optional(),
		sort: FavouriteSortSchema.array().optional(),
	})
	.openapi("FavouriteQuery", {
		description: "Query object for favourite collection",
	});

export type FavouriteQuerySchema = typeof FavouriteQuerySchema;

export namespace FavouriteQuerySchema {
	export type Type = z.infer<FavouriteQuerySchema>;
}
