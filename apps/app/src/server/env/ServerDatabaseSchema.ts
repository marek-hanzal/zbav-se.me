import { z } from "zod";

export const ServerDatabaseSchema = z
	.looseObject({
		SERVER_DATABASE_URL: z.string().min(1, "Database URL is required"),
	})
	.strip()
	.meta({
		id: "ServerDatabase",
		description: "Environment variables required to connect to the database.",
	});
