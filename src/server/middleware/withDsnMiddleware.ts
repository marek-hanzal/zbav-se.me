import { createMiddleware } from "@tanstack/react-start";
import { ServerDatabaseSchema } from "~/server/env/ServerDatabaseSchema";

export const withDsnMiddleware = createMiddleware().server(async ({ next }) => {
	const databaseConfig = ServerDatabaseSchema.parse(process.env);

	return next({
		context: {
			dsn: databaseConfig.SERVER_DATABASE_URL,
		},
	});
});
