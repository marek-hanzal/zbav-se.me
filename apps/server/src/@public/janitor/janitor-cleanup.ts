import { createRoute, z } from "@hono/zod-openapi";
import type { Routes } from "../../hono/Routes";
import { MessageSchema } from "../../schema/MessageSchema";
import { cleanup } from "./cleanup/cleanup";
import { CleanupSchema } from "./schema/CleanupSchema";

export const withJanitorCleanupApi: Routes.Fn = ({ publicHono }) => {
	publicHono.openapi(
		createRoute({
			method: "get",
			path: "/janitor/cleanup",
			description: "General cleanup operation",
			operationId: "apiJanitorCleanup",
			responses: {
				200: {
					content: {
						"application/json": {
							schema: z.array(CleanupSchema),
						},
					},
					description: "When cleanup is done",
				},
				500: {
					content: {
						"application/json": {
							schema: MessageSchema,
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
					(await Promise.all(cleanup.map((fn) => fn()))) satisfies CleanupSchema.Type[],
					200,
				);
			} catch (e) {
				console.error(e);
				return c.json<MessageSchema.Type, 500>(
					{
						type: "error",
						message: "Cleanup failed",
					},
					500,
				);
			}
		},
	);
};
