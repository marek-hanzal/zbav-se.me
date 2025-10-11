import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

const HealthSchema = z
	.object({
		status: z.boolean().openapi({
			example: true,
		}),
	})
	.openapi("Health");

export const healthRoot = new OpenAPIHono();

healthRoot.openapi(
	createRoute({
		method: "get",
		path: "/health",
		description:
			"Provides health check, just returns a bool; if this endpoint does not work, something is really wrong.",
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
	}),
	(c) => {
		return c.json({
			status: true,
		});
	},
);
