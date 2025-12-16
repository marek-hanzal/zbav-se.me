import type { z } from "@hono/zod-openapi";
import { FeedQuerySchema } from "./FeedQuerySchema";

export const FeedCountQuerySchema = FeedQuerySchema.pick({
	filter: true,
	where: true,
}).openapi("FeedCountQuery", {
	description: "Query object for feed count",
});

export type FeedCountQuerySchema = typeof FeedCountQuerySchema;

export namespace FeedCountQuerySchema {
	export type Type = z.infer<FeedCountQuerySchema>;
}
