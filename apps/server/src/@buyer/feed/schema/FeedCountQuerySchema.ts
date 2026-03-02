import { z } from "@hono/zod-openapi";
import { FeedQuerySchema } from "~/@buyer/feed/schema/FeedQuerySchema";

export const FeedCountQuerySchema = z
	.looseObject({
		...FeedQuerySchema.pick({
			filter: true,
			where: true,
		}).shape,
	})
	.strip()
	.openapi("FeedCountQuery", {
		description: "Query object for feed count",
	});

export type FeedCountQuerySchema = typeof FeedCountQuerySchema;

export namespace FeedCountQuerySchema {
	export type Type = z.infer<FeedCountQuerySchema>;
}
