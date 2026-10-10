import { createFileRoute } from "@tanstack/react-router";
import { withTokenMiddlewareFn } from "~/request-middleware/middleware/withTokenMiddlewareFn";
import { ServerMigrationSchema } from "~/server-env/schema/ServerMigrationSchema";

export const Route = createFileRoute("/api/public/migration/run")({
	server: {
		middleware: [
			withTokenMiddlewareFn({
				async tokenFn() {
					return ServerMigrationSchema.parse(process.env).SERVER_MIGRATION_TOKEN;
				},
			}),
		],
		handlers: {
			async GET({ context: { database } }) {
				return Response.json(await database.migrateFn());
			},
			async POST({ context: { database } }) {
				return Response.json(await database.migrateFn());
			},
		},
	},
});
