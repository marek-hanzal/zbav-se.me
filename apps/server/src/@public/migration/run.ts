import { createRoute, z } from "@hono/zod-openapi";
import { Effect } from "effect";
import { RoutesContextFx } from "~/@common/route/context/RoutesContextFx";
import { MigrationSchema } from "./schema/MigrationSchema";

export const withMigrationRunApiFx = Effect.fn("withMigrationRunApiFx")(function* () {
	const { publicHono } = yield* RoutesContextFx;

	publicHono.openapi(
		createRoute({
			method: "post",
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
			security: [],
			tags: [
				"Misc",
			],
		}),
		async (c) => {
			return c.json((await c.get("kysely").migrate()) ?? [], 200);
		},
	);
});
