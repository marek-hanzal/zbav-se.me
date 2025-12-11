import type { z } from "@hono/zod-openapi";
import { FavouriteQuerySchema } from "./FavouriteQuerySchema";

export const FavouriteCountQuerySchema = FavouriteQuerySchema.pick({
	filter: true,
	where: true,
}).openapi("FavouriteCountQuery", {
	description: "Query object for favourite count",
});

export type FavouriteCountQuerySchema = typeof FavouriteCountQuerySchema;

export namespace FavouriteCountQuerySchema {
	export type Type = z.infer<FavouriteCountQuerySchema>;
}
