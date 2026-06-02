import { createFileRoute } from "@tanstack/react-router";
import { ServerMigrationSchema } from "~/server/env/ServerMigrationSchema";
import { withTokenMiddleware } from "~/server/middleware/withTokenMiddleware";

export const Route = createFileRoute("/api/public/migration/run")({
	server: {
		middleware: [
			withTokenMiddleware({
				async token() {
					return ServerMigrationSchema.parse(process.env).SERVER_MIGRATION_TOKEN;
				},
			}),
		],
		handlers: {
			async GET({ context: { database } }) {
				return Response.json(await database.migrate());
			},
			async POST({ context: { database } }) {
				return Response.json(await database.migrate());
			},
		},
	},
});
