import { z } from "@hono/zod-openapi";
import { CountEnumSchema } from "@use-pico/common/schema";
import { FeedQuerySchema } from "./FeedQuerySchema";

export const FeedCountQuerySchema = z
	.looseObject({
		...FeedQuerySchema.pick({
			filter: true,
			where: true,
		}).shape,
		count: CountEnumSchema.array().optional(),
	})
	.strip()
	.openapi("FeedCountQuery", {
		description: "Query object for feed count",
	});

export type FeedCountQuerySchema = typeof FeedCountQuerySchema;

export namespace FeedCountQuerySchema {
	export type Type = z.infer<FeedCountQuerySchema>;
}
