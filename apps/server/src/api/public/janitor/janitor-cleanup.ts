import { createRoute, z } from "@hono/zod-openapi";
import type { Routes } from "../../../hono/Routes";
import { ErrorDtoSchema } from "../../../schema/ErrorDtoSchema";
import { cleanup } from "./cleanup/cleanup";
import { CleanupDtoSchema } from "./dto/CleanupDtoSchema";

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
							schema: z.array(CleanupDtoSchema),
						},
					},
					description: "When cleanup is done",
				},
				500: {
					content: {
						"application/json": {
							schema: ErrorDtoSchema,
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
					)) satisfies CleanupDtoSchema.Type[],
					200,
				);
			} catch (e) {
				console.error(e);
				return c.json(
					{
						message: "Cleanup failed",
					} satisfies ErrorDtoSchema.Type,
					500,
				);
			}
		},
	);
};
