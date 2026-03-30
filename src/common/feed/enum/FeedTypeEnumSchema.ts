import { z } from "zod";

export const FeedTypeEnumSchema = z
	.enum([
		"user",
		"search",
	])
	.meta({
		id: "FeedTypeEnum",
		description: "Type of the feed",
	});

export type FeedTypeEnumSchema = typeof FeedTypeEnumSchema;

export namespace FeedTypeEnumSchema {
	export type Type = z.infer<FeedTypeEnumSchema>;
}
