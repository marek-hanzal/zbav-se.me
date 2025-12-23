import { z } from "@hono/zod-openapi";

export const FeedbackEnumSchema = z
	.enum([
		"like",
		"dislike",
	])
	.openapi("FeedbackEnum", {
		description: "Type of feedback",
	});

export type FeedbackEnumSchema = typeof FeedbackEnumSchema;

export namespace FeedbackEnumSchema {
	export type Type = z.infer<FeedbackEnumSchema>;
}
