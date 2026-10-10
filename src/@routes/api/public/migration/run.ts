import { createFileRoute } from "@tanstack/react-router";
import { withTokenMiddleware } from "~/request-middleware/middleware/withTokenMiddleware";
import { ServerMigrationSchema } from "~/server-env/schema/ServerMigrationSchema";

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
