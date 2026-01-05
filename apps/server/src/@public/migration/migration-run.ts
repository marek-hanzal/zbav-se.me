import { createRoute, z } from "@hono/zod-openapi";
import { database } from "~/database/kysely";
import type { Routes } from "~/hono/Routes";
import { MigrationSchema } from "./schema/MigrationSchema";

export const withMigrationRunApi: Routes.Fn = async ({ publicHono }) => {
	publicHono.openapi(
		createRoute({
			method: "get",
			path: "/migration/run",
			description: "This route directly executes the migrations",
			operationId: "apiMigrationRun",
			responses: {
				200: {
					content: {
						"application/json": {
							schema: z.array(MigrationSchema),
						},
					},
					description: "Executes app migrations",
				},
			},
			tags: [
				"misc",
			],
		}),
		async (c) => {
			return c.json((await database.migrate()) ?? [], 200);
		},
	);
};
