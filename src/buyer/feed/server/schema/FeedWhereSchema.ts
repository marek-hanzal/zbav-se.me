import { z } from "zod";
import { FeedFilterSchema } from "~/buyer/feed/server/schema/FeedFilterSchema";

export const FeedWhereSchema = z
	.looseObject({
		...FeedFilterSchema.shape,
	})
	.strip()
	.meta({
		id: "FeedWhere",
		description: "App-based filters",
	});

export type FeedWhereSchema = typeof FeedWhereSchema;

export namespace FeedWhereSchema {
	export type Type = z.infer<FeedWhereSchema>;
}
