import { createRoute, z } from "@hono/zod-openapi";
import { Effect } from "effect";
import { RoutesContextFx } from "~/app/routes/RoutesContextFx";
import { database } from "~/database/kysely";
import { MigrationSchema } from "./schema/MigrationSchema";

export const withMigrationRunApiFx = Effect.fn("withMigrationRunApiFx")(function* () {
	const { publicHono } = yield* RoutesContextFx;

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
			return c.json((await kysely.migrate()) ?? [], 200);
		},
	);
});
