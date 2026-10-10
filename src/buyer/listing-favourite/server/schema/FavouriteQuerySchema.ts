import { z } from "zod";
import { FavouriteSortSchema } from "~/buyer/listing-favourite/server/schema/FavouriteSortSchema";
import { FavouriteWhereSchema } from "~/buyer/listing-favourite/server/schema/FavouriteWhereSchema";
import { CursorSchema } from "~/query/schema/CursorSchema";

export const FavouriteQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
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
