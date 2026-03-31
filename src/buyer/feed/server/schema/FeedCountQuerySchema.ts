import { z } from "zod";
import { FeedQuerySchema } from "~/buyer/feed/server/schema/FeedQuerySchema";

export const FeedCountQuerySchema = z
	.looseObject({
		...FeedQuerySchema.pick({
			filter: true,
			where: true,
		}).shape,
	})
	.strip()
	.meta({
		id: "FeedCountQuery",
		description: "Query object for feed count",
	});

export type FeedCountQuerySchema = typeof FeedCountQuerySchema;

export namespace FeedCountQuerySchema {
	export type Type = z.infer<FeedCountQuerySchema>;
}
