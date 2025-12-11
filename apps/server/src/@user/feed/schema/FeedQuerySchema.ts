import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { FeedFilterSchema } from "./FeedFilterSchema";
import { FeedSortSchema } from "./FeedSortSchema";

export const FeedQuerySchema = z
	.object({
		cursor: CursorSchema.optional(),
		filter: FeedFilterSchema.optional(),
		where: FeedFilterSchema.optional().openapi("FeedWhere", {
			description: "App-based filters",
		}),
		sort: FeedSortSchema.array().optional(),
	})
	.openapi("FeedQuery", {
		description: "Query object for feed collection",
	});

export type FeedQuerySchema = typeof FeedQuerySchema;

export namespace FeedQuerySchema {
	export type Type = z.infer<typeof FeedQuerySchema>;
}
