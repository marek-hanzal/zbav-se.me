import { z } from "@hono/zod-openapi";

export const MigrationDtoSchema = z
	.object({
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
	})
	.openapi("MigrationDto", {
		description: "Migration data transfer object",
	});

export type MigrationDtoSchema = typeof MigrationDtoSchema;

export namespace MigrationDtoSchema {
	export type Type = z.infer<MigrationDtoSchema>;
}
