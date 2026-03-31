import { createMiddleware } from "@tanstack/react-start";
import { withDatabaseName } from "@/lib/common/database/withDatabaseName";
import { ServerDatabaseSchema } from "~/server/env/ServerDatabaseSchema";
import { ServerE2eSchema } from "~/server/env/ServerE2eSchema";

export const withDsnMiddleware = createMiddleware().server(async ({ next, request }) => {
	const e2eConfig = ServerE2eSchema.parse(process.env);
	const databaseConfig = ServerDatabaseSchema.parse(process.env);
	const db =
		e2eConfig.SERVER_E2E === "e2e" ? (request.headers.get("x-e2e-db") ?? undefined) : undefined;
	const dsn = db
		? withDatabaseName({
				dsn: databaseConfig.SERVER_DATABASE_URL,
				name: db,
			})
		: databaseConfig.SERVER_DATABASE_URL;

	return next({
		context: {
			dsn,
		},
	});
});
