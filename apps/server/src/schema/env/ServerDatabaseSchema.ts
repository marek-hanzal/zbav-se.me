import z from "zod";

export const ServerDatabaseSchema = z.object({
	SERVER_DATABASE_URL: z.string().min(1, "Database URL is required"),
});
