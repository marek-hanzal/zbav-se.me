import { z } from "@hono/zod-openapi";

export const FeedTypeEnumSchema = z
	.enum([
		"user",
		"search",
	])
	.openapi("FeedTypeEnum", {
		description: "Type of the feed",
	});

export type FeedTypeEnumSchema = typeof FeedTypeEnumSchema;

export namespace FeedTypeEnumSchema {
	export type Type = z.infer<FeedTypeEnumSchema>;
}
