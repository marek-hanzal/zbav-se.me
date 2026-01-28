import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { FeedFilterSchema } from "~/@buyer-user/feed/schema/FeedFilterSchema";
import { FeedSortSchema } from "~/@buyer-user/feed/schema/FeedSortSchema";
import { FeedWhereSchema } from "~/@buyer-user/feed/schema/FeedWhereSchema";

export const FeedQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: FeedFilterSchema.optional(),
		where: FeedWhereSchema.optional(),
		sort: FeedSortSchema.array().optional(),
	})
	.strip()
	.openapi("FeedQuery", {
		description: "Query object for feed collection",
	});

export type FeedQuerySchema = typeof FeedQuerySchema;

export namespace FeedQuerySchema {
	export type Type = z.infer<typeof FeedQuerySchema>;
}
