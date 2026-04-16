import { z } from "zod";
import { FeedQuerySchema } from "./FeedQuerySchema";
import { FeedToolFilterSchema } from "./FeedToolFilterSchema";

export const FeedToolQuerySchema = z
	.looseObject({
		...FeedQuerySchema.shape,
		filter: FeedToolFilterSchema.optional(),
		where: FeedToolFilterSchema.optional(),
	})
	.omit({
		where: true,
		limit: true,
	})
	.strip()
	.meta({
		id: "FeedToolQuery",
		description: "Query object for feed tools",
	});

export type FeedToolQuerySchema = typeof FeedToolQuerySchema;

export namespace FeedToolQuerySchema {
	export type Type = z.infer<FeedToolQuerySchema>;
}
