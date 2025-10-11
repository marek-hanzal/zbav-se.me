import { createRoute, z } from "@hono/zod-openapi";

const healthSchema = z
	.object({
		status: z.boolean().openapi({
			example: true,
		}),
	})
	.openapi("Health");

export const healthRoute = createRoute({
	method: "get",
	path: "/health",
	responses: {
		200: {
			content: {
				"application/json": {
					schema: healthSchema,
				},
			},
			description: "Just health check",
		},
	},
});
