import { z } from "@hono/zod-openapi";

export const MigrationSchema = z.object({
	migrationName: z.string().openapi({
		description: "Migration name run",
	}),
	direction: z
		.enum([
			"Up",
			"Down",
		])
		.openapi({
			description: "Migration direction",
		}),
	status: z
		.enum([
			"Success",
			"Error",
			"NotExecuted",
		])
		.openapi({
			description: "Migration status",
		}),
});

export type MigrationSchema = typeof MigrationSchema;

export namespace MigrationSchema {
	export type Type = z.infer<MigrationSchema>;
}
