import { createMiddleware } from "@tanstack/react-start";
import { setResponseHeader } from "@tanstack/react-start/server";
import { withDatabaseNameFn } from "~/database-query/fn/withDatabaseNameFn";
import { ServerDatabaseSchema } from "~/server-env/schema/ServerDatabaseSchema";
import { ServerE2eSchema } from "~/server-env/schema/ServerE2eSchema";

export const withDsnMiddleware = createMiddleware().server(async ({ next: nextFn, request }) => {
	const e2eConfig = ServerE2eSchema.parse(process.env);
	const databaseConfig = ServerDatabaseSchema.parse(process.env);
	//
	const isE2e = e2eConfig.SERVER_E2E === "e2e";
	const db = isE2e ? (request.headers.get("x-e2e-db") ?? undefined) : undefined;
	const dsn = db
		? withDatabaseNameFn({
				dsn: databaseConfig.SERVER_DATABASE_URL,
				name: db,
			})
		: databaseConfig.SERVER_DATABASE_URL;

	if (isE2e) {
		setResponseHeader("x-e2e-db", db ?? "unset");
	}

	return nextFn({
		context: {
			dsn,
		},
	});
});
