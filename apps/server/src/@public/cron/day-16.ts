import { createRoute } from "@hono/zod-openapi";
import type { Routes } from "~/hono/Routes";
import { CronSchema } from "./schema/CronSchema";

export const withDay16Endpoint: Routes.Fn = ({ publicHono }) => {
	publicHono.openapi(
		createRoute({
			method: "get",
			path: "/cron/day-16",
			description: "Daily cron job endpoint (hour 16)",
			operationId: "apiCronDay16",
			responses: {
				200: {
					content: {
						"application/json": {
							schema: CronSchema,
						},
					},
					description: "Daily cron job executed (hour 16)",
				},
			},
			tags: [
				"cron",
				"public",
			],
		}),
		(c) => {
			return c.json<CronSchema.Type, 200>({
				status: {
					type: "info",
					message: "Daily cron job executed (hour 16)",
				},
				timestamp: new Date(),
			});
		},
	);
};
