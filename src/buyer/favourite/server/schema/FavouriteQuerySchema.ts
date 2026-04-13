import { z } from "zod";
import { CursorSchema } from "@/lib/common/schema";
import { FavouriteFilterSchema } from "~/buyer/favourite/server/schema/FavouriteFilterSchema";
import { FavouriteSortSchema } from "~/buyer/favourite/server/schema/FavouriteSortSchema";
import { FavouriteWhereSchema } from "~/buyer/favourite/server/schema/FavouriteWhereSchema";

export const FavouriteQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: FavouriteFilterSchema.optional(),
		where: FavouriteWhereSchema.optional(),
		sort: FavouriteSortSchema.array().optional(),
		limit: z.int().nonnegative().optional().meta({
			description:
				"Guardrail limit for collection size; usually set/overridden by the system",
		}),
	})
	.strip()
	.meta({
		id: "FavouriteQuery",
		description: "Query object for favourite collection",
	});

export type FavouriteQuerySchema = typeof FavouriteQuerySchema;

export namespace FavouriteQuerySchema {
	export type Type = z.infer<FavouriteQuerySchema>;
}
