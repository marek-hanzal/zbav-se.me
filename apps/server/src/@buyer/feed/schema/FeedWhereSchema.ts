import { z } from "@hono/zod-openapi";
import { FeedFilterSchema } from "~/@buyer/feed/schema/FeedFilterSchema";

export const FeedWhereSchema = z
	.object({
		...FeedFilterSchema.shape,
	})
	.openapi("FeedWhere", {
		description: "App-based filters",
	});

export type FeedWhereSchema = typeof FeedWhereSchema;

export namespace FeedWhereSchema {
	export type Type = z.infer<FeedWhereSchema>;
}
