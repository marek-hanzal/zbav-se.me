import { createRoute, z } from "@hono/zod-openapi";
import type { Routes } from "../hono/Routes";
import { withHono } from "../hono/withHono";

const HealthSchema = z
	.object({
		status: z.boolean(),
	})
	.openapi("Health");

export const withHealthApi: Routes.Fn = ({ public: publicRoutes }) => {
	const hono = withHono();

	hono.openapi(
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
			],
		}),
		(c) => {
			return c.json({
				status: true,
			});
		},
	);

	publicRoutes.route("/", hono);
};
