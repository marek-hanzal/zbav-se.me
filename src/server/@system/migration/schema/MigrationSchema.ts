import { z } from "zod";

export const MigrationSchema = z
	.looseObject({
		migrationName: z.string().meta({
			description: "Migration name run",
		}),
		direction: z
			.enum([
				"Up",
				"Down",
			])
			.meta({
				description: "Migration direction",
			}),
		status: z
			.enum([
				"Success",
				"Error",
				"NotExecuted",
			])
			.meta({
				description: "Migration status",
			}),
	})
	.strip()
	.meta({
		id: "Migration",
		description: "Migration run record",
	});

export type MigrationSchema = typeof MigrationSchema;

export namespace MigrationSchema {
	export type Type = z.infer<MigrationSchema>;
}
