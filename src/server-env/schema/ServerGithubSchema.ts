import z from "zod";

export const ServerGithubSchema = z
	.looseObject({
		SERVER_GITHUB: z.string().min(1, "GitHub token is required"),
	})
	.strip();

export type ServerGithubSchema = typeof ServerGithubSchema;

export namespace ServerGithubSchema {
	export type Type = z.infer<ServerGithubSchema>;
}
