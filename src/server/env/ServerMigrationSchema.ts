import { z } from "zod";

export const ServerMigrationSchema = z
	.looseObject({
		SERVER_MIGRATION_TOKEN: z.string().min(1, "Missing migration token"),
	})
	.strip();

export type ServerMigrationSchema = typeof ServerMigrationSchema;

export namespace ServerMigrationSchema {
	export type Type = z.infer<ServerMigrationSchema>;
}
