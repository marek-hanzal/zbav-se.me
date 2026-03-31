import { z } from "zod";

export const GitHubHistorySchema = z
	.looseObject({
		date: z.string().meta({
			description: "UTC day (YYYY-MM-DD)",
			example: "2025-12-17",
		}),
		count: z.number().int().min(0).meta({
			description: "Number of commits on this day",
			example: 3,
		}),
	})
	.strip()
	.meta({
		id: "GitHubHistory",
		description: "GitHub commit history count",
	});

export type GitHubHistorySchema = typeof GitHubHistorySchema;

export namespace GitHubHistorySchema {
	export type Type = z.infer<GitHubHistorySchema>;
}
