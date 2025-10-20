import { createRoute, z } from "@hono/zod-openapi";
import { database } from "../database/kysely";
import type { Routes } from "../hono/Routes";
import { withHono } from "../hono/withHono";

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

export const withMigrationApi = ({ public: publicRoutes }: Routes) => {
	const hono = withHono();

	hono.openapi(
		createRoute({
			method: "get",
			path: "/migration/run",
			description: "This route directly executes the migrations",
			operationId: "apiMigrationRun",
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
			tags: [
				"misc",
			],
		}),
		async (c) => {
			return c.json(await database.migrate());
		},
	);

	publicRoutes.route("/", hono);
};
