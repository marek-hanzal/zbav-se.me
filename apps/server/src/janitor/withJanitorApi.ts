import { createRoute } from "@hono/zod-openapi";
import type { Routes } from "../hono/Routes";
import { withHono } from "../hono/withHono";
import { ErrorSchema } from "../schema/ErrorSchema";
import { cleanup } from "./cleanup/cleanup";
import { CleanupResponseSchema } from "./schema/CleanupResponseSchema";

export const withJanitorApi: Routes.Fn = ({ public: publicEndpoints }) => {
	const endpoints = withHono();

	endpoints.openapi(
		createRoute({
			method: "get",
			path: "/janitor/cleanup",
			description: "Smaže z MinIO vše, co není v tabulce `upload`.",
			operationId: "apiJanitorCleanup",
			responses: {
				200: {
					content: {
						"application/json": {
							schema: CleanupResponseSchema,
						},
					},
					description: "When cleanup is done",
				},
				500: {
					content: {
						"application/json": {
							schema: ErrorSchema,
						},
					},
					description: "Error during cleanup",
				},
			},
			tags: [
				"janitor",
			],
		}),
		async (c) => {
			try {
				return c.json(
					(await Promise.all(
						cleanup.map((fn) => fn()),
					)) satisfies CleanupResponseSchema.Type,
					200,
				);
			} catch (e) {
				console.error(e);
				return c.json(
					{
						message: "Cleanup failed",
					} satisfies ErrorSchema.Type,
					500,
				);
			}
		},
	);

	publicEndpoints.route("/", endpoints);
};
