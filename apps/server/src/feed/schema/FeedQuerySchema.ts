import { z } from "@hono/zod-openapi";
import { CursorSchema } from "../../schema/CursorSchema";
import { FeedFilterSchema } from "./FeedFilterSchema";
import { FeedSortSchema } from "./FeedSortSchema";

export const FeedQuerySchema = z
	.object({
		cursor: CursorSchema.nullish(),
		filter: FeedFilterSchema.nullish(),
		where: FeedFilterSchema.openapi({
			description: "App-based filters",
		}).nullish(),
		sort: FeedSortSchema.array().nullish(),
	})
	.openapi("FeedQuery", {
		description: "Query object for feed collection",
	});

export type FeedQuerySchema = typeof FeedQuerySchema;

export namespace FeedQuerySchema {
	export type Type = z.infer<typeof FeedQuerySchema>;
}
