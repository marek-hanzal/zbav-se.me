import { CursorSchema } from "@use-pico/common/schema";
import { z } from "zod";
import { FeedFilterSchema } from "~/client/@buyer/feed/server/schema/FeedFilterSchema";
import { FeedSortSchema } from "~/client/@buyer/feed/server/schema/FeedSortSchema";
import { FeedWhereSchema } from "~/client/@buyer/feed/server/schema/FeedWhereSchema";

export const FeedQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: FeedFilterSchema.optional(),
		where: FeedWhereSchema.optional(),
		sort: FeedSortSchema.array().optional(),
	})
	.strip()
	.meta({
		id: "FeedQuery",
		description: "Query object for feed collection",
	});

export type FeedQuerySchema = typeof FeedQuerySchema;

export namespace FeedQuerySchema {
	export type Type = z.infer<typeof FeedQuerySchema>;
}
