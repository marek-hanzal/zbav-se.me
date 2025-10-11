import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { database } from "../database/kysely";

const MigrationSchema = z
	.object({
		migrationName: z.string().openapi({
			description: "Migration name run",
		}),
		direction: z
			.enum([
				"Up",
				"Down",
			])
			.openapi({
				description: "Migration direction",
			}),
		status: z
			.enum([
				"Success",
				"Error",
				"NotExecuted",
			])
			.openapi({
				description: "Migration status",
			}),
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
						schema: z.array(MigrationSchema).optional(),
					},
				},
				description: "Executes app migrations",
			},
		},
	}),
	async (c) => {
		return c.json(await database.migrate());
	},
);
