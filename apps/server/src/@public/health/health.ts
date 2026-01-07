import { createRoute } from "@hono/zod-openapi";
import { Effect } from "effect";
import { RoutesContextFx } from "~/app/routes/RoutesContextFx";
import { HealthSchema } from "./schema/HealthSchema";

export const withHealthEndpointFx = Effect.fn("withHealthEndpointFx")(function* () {
	const { publicHono } = yield* RoutesContextFx;

	publicHono.openapi(
		createRoute({
			method: "get",
			path: "/health",
			description:
				"Provides health check, just returns a bool; if this endpoint does not work, something is really wrong.",
			operationId: "apiHealth",
			responses: {
				200: {
					content: {
						"application/json": {
							schema: HealthSchema,
						},
					},
					description: "Just health check",
				},
			},
			tags: [
				"misc",
				"public",
			],
		}),
		(c) => {
			return c.json({
				status: true,
			});
		},
	);
});
