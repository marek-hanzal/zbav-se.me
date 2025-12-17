import { z } from "@hono/zod-openapi";
import { GitHubDbSchema } from "~/app/github/schema/GitHubDbSchema";

export const GitHubHistorySchema = z
	.object({
		...GitHubDbSchema.shape,
	})
	.omit({
		id: true,
	});

export type GitHubHistorySchema = typeof GitHubHistorySchema;

export namespace GitHubHistorySchema {
	export type Type = z.infer<GitHubHistorySchema>;
}
