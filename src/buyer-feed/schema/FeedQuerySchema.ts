import { z } from "zod";
import { FeedSortSchema } from "~/buyer-feed/schema/FeedSortSchema";
import { FeedWhereSchema } from "~/buyer-feed/schema/FeedWhereSchema";
import { CursorSchema } from "~/query/schema/CursorSchema";

export const FeedQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
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
