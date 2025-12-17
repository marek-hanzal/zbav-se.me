import { z } from "@hono/zod-openapi";

export const GitHubHistorySchema = z
	.object({
		date: z.string().openapi({
			description: "UTC day (YYYY-MM-DD)",
			example: "2025-12-17",
		}),
		count: z.number().int().min(0).openapi({
			description: "Number of commits on this day",
			example: 3,
		}),
	})
	.strict();

export type GitHubHistorySchema = typeof GitHubHistorySchema;

export namespace GitHubHistorySchema {
	export type Type = z.infer<GitHubHistorySchema>;
}
