import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

const MigrationSchema = z
	.object({
		status: z.boolean(),
	})
	.openapi("Migration");

export const migrationRoot = new OpenAPIHono();

migrationRoot.openapi(
	createRoute({
		method: "get",
		path: "/migration/run",
		description: "This route directly executes the migrations",
		responses: {
			200: {
				content: {
					"application/json": {
						schema: MigrationSchema,
					},
				},
				description: "Executes app migrations",
			},
		},
	}),
	(c) => {
		return c.json({
			status: true,
		});
	},
);
