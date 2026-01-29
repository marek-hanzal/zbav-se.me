import { z } from "@hono/zod-openapi";

export const ThumbEnumSchema = z
	.enum([
		"like",
		"dislike",
	])
	.openapi("ThumbEnum", {
		description: "Type of thumb",
	});

export type ThumbEnumSchema = typeof ThumbEnumSchema;

export namespace ThumbEnumSchema {
	export type Type = z.infer<ThumbEnumSchema>;
}
