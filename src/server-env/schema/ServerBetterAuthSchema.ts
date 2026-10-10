import z from "zod";

export const ServerBetterAuthSchema = z
	.looseObject({
		SERVER_BETTER_AUTH_SECRET: z.string().min(1, "Better Auth secret is required"),
	})
	.strip();

export type ServerBetterAuthSchema = typeof ServerBetterAuthSchema;

export namespace ServerBetterAuthSchema {
	export type Type = z.infer<ServerBetterAuthSchema>;
}
