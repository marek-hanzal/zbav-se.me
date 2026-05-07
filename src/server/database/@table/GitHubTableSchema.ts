import { z } from "zod";

export const GitHubTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "GitHub node ID",
		}),
		sha: z.string().meta({
			description: "Commit SHA",
		}),
		date: z.coerce.date().meta({
			description: "Commit date",
			type: "string",
		}),
		message: z.string().meta({
			description: "Commit message",
		}),
	})
	.meta({
		id: "GitHubTable",
		description: "Database row for a GitHub history entry.",
	})
	.strip();

export type GitHubTableSchema = typeof GitHubTableSchema;

export namespace GitHubTableSchema {
	export type Type = z.infer<GitHubTableSchema>;
}
