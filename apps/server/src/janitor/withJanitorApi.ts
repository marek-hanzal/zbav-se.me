import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";
import type { Routes } from "../hono/Routes";
import { withHono } from "../hono/withHono";
import { ErrorSchema } from "../schema/ErrorSchema";

export const withJanitorApi: Routes.Fn = ({ public: publicEndpoints }) => {
	const endpoints = withHono();

	endpoints.openapi(
		createRoute({
			method: "post",
			path: "/janitor/cleanup",
			description: "Perform cleanup operations",
			operationId: "apiJanitorCleanup",
			request: {
				body: {
					content: {
						"application/json": {
							schema: z.object({}),
						},
					},
					description: "Cleanup request body",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: z.object({}),
						},
					},
					description: "Cleanup operation completed successfully",
				},
				500: {
					content: {
						"application/json": {
							schema: ErrorSchema,
						},
					},
					description: "Internal server error during cleanup",
				},
			},
			tags: [
				"janitor",
			],
		}),
		async (c) => {
			try {
				return c.json({}, 200);
			} catch {
				return c.json(
					{
						message: "Cleanup operation failed",
					} satisfies ErrorSchema.Type,
					500,
				);
			}
		},
	);

	publicEndpoints.route("/", endpoints);
};
