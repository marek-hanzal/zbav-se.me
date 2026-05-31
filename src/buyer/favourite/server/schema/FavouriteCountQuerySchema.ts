import { z } from "zod";
import { FavouriteQuerySchema } from "~/buyer/favourite/server/schema/FavouriteQuerySchema";

export const FavouriteCountQuerySchema = z
	.looseObject({
		...FavouriteQuerySchema.pick({
			where: true,
		}).shape,
	})
	.strip()
	.meta({
		id: "FavouriteCountQuery",
		description: "Query object for favourite count",
	});

export type FavouriteCountQuerySchema = typeof FavouriteCountQuerySchema;

export namespace FavouriteCountQuerySchema {
	export type Type = z.infer<FavouriteCountQuerySchema>;
}
