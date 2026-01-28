import { z } from "@hono/zod-openapi";
import { CountEnumSchema } from "@use-pico/common/schema";
import { FavouriteQuerySchema } from "~/@buyer-user/favourite/schema/FavouriteQuerySchema";

export const FavouriteCountQuerySchema = z
	.looseObject({
		...FavouriteQuerySchema.pick({
			filter: true,
			where: true,
		}).shape,
		count: CountEnumSchema.array().optional(),
	})
	.strip()
	.openapi("FavouriteCountQuery", {
		description: "Query object for favourite count",
	});

export type FavouriteCountQuerySchema = typeof FavouriteCountQuerySchema;

export namespace FavouriteCountQuerySchema {
	export type Type = z.infer<FavouriteCountQuerySchema>;
}
