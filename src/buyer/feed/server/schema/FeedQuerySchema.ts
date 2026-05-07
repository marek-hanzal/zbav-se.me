import { z } from "zod";
import { CursorSchema } from "@/lib/common/schema";
import { FeedFilterSchema } from "~/buyer/feed/server/schema/FeedFilterSchema";
import { FeedSortSchema } from "~/buyer/feed/server/schema/FeedSortSchema";
import { FeedWhereSchema } from "~/buyer/feed/server/schema/FeedWhereSchema";

export const FeedQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: FeedFilterSchema.optional(),
		where: FeedWhereSchema.optional(),
		sort: FeedSortSchema.array().optional(),
		limit: z.int().nonnegative().optional().meta({
			description:
				"Guardrail limit for collection size; usually set/overridden by the system",
		}),
	})
	.strip()
	.meta({
		id: "FeedQuery",
		description: "Query object for feed collection",
	});

export type FeedQuerySchema = typeof FeedQuerySchema;

export namespace FeedQuerySchema {
	export type Type = z.infer<FeedQuerySchema>;
}
