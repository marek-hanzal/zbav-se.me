import { createRoute, z } from "@hono/zod-openapi";
import { database } from "../../../database/kysely";
import type { Routes } from "../../../hono/Routes";
import { MigrationDtoSchema } from "./dto/MigrationDtoSchema";

export const withMigrationRunApi: Routes.Fn = ({ publicHono }) => {
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
							schema: z.array(MigrationDtoSchema),
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
