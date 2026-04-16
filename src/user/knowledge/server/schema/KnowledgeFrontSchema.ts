import { z } from "zod";

export const KnowledgeFrontSchema = z
	.looseObject({
		key: z.string().describe("Knowledge key for fetching a detail"),
		title: z.string().describe("Knowledge title"),
		summary: z.string().describe("Short summary for fast relevant search"),
		related: z
			.array(z.string())
			.optional()
			.describe("Array of related keys (can be used to fetch detail)"),
	})
	.strip();

export type KnowledgeFrontSchema = typeof KnowledgeFrontSchema;

export namespace KnowledgeFrontSchema {
	export type Type = z.infer<KnowledgeFrontSchema>;
}
