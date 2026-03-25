import { z } from "@hono/zod-openapi";

export const GitHubTableSchema = z.object({
	id: z.string().openapi({
		description: "GitHub node ID",
	}),
	sha: z.string().openapi({
		description: "Commit SHA",
	}),
	date: z.coerce.date().openapi({
		description: "Commit date",
		type: "string",
	}),
	message: z.string().openapi({
		description: "Commit message",
	}),
});

export type GitHubTableSchema = typeof GitHubTableSchema;

export namespace GitHubTableSchema {
	export type Type = z.infer<GitHubTableSchema>;
}
