import { z } from "zod";
import { FeedToolQuerySchema } from "~/buyer/feed/server/schema/FeedToolQuerySchema";

export const FeedToolCountQuerySchema = z
	.looseObject({
		...FeedToolQuerySchema.pick({
			filter: true,
		}).shape,
	})
	.strip()
	.meta({
		id: "FeedToolCountQuery",
		description: "Query object for feed count",
	});

export type FeedToolCountQuerySchema = typeof FeedToolCountQuerySchema;

export namespace FeedToolCountQuerySchema {
	export type Type = z.infer<FeedToolCountQuerySchema>;
}
