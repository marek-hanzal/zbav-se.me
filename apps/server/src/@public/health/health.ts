import { createRoute } from "@hono/zod-openapi";
import type { Routes } from "~/hono/Routes";
import { HealthSchema } from "./schema/HealthSchema";

export const withHealthEndpoint: Routes.Fn = async ({ publicHono }) => {
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
};
