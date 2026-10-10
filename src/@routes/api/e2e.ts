import { createFileRoute } from "@tanstack/react-router";
import { DialectStore } from "~/database/service/DialectStore";
import { withDatabaseNameFn } from "~/database-query/fn/withDatabaseNameFn";
import { ServerDatabaseSchema } from "~/server-env/schema/ServerDatabaseSchema";
import { ServerE2eSchema } from "~/server-env/schema/ServerE2eSchema";

export const Route = createFileRoute("/api/e2e")({
	server: {
		handlers: {
			async GET({ request }) {
				const e2eConfig = ServerE2eSchema.parse(process.env);

				if (e2eConfig.SERVER_E2E !== "e2e") {
					return new Response(null, {
						status: 404,
					});
				}

				return Response.json({
					db: request.headers.get("x-e2e-db"),
				});
			},
			async DELETE({ request }) {
				const e2eConfig = ServerE2eSchema.parse(process.env);

				if (e2eConfig.SERVER_E2E !== "e2e") {
					return new Response(null, {
						status: 404,
					});
				}

				const db = request.headers.get("x-e2e-db");

				if (!db) {
					return Response.json(
						{
							closed: false,
						},
						{
							status: 400,
						},
					);
				}

				const databaseConfig = ServerDatabaseSchema.parse(process.env);
				const dsn = withDatabaseNameFn({
					dsn: databaseConfig.SERVER_DATABASE_URL,
					name: db,
				});

				return Response.json({
					closed: await DialectStore.closeFn(dsn),
				});
			},
		},
	},
});
