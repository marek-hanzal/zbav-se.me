import { z } from "zod";

export const ThumbEnumSchema = z
	.enum([
		"like",
		"dislike",
	])
	.meta({
		id: "ThumbEnum",
		description: "Type of thumb reaction",
	});

export type ThumbEnumSchema = typeof ThumbEnumSchema;

export namespace ThumbEnumSchema {
	export type Type = z.infer<ThumbEnumSchema>;
}
