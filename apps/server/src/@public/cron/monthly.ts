import { createRoute } from "@hono/zod-openapi";
import type { Routes } from "~/hono/Routes";
import { CronSchema } from "./schema/CronSchema";

export const withMonthlyEndpoint: Routes.Fn = ({ publicHono }) => {
	publicHono.openapi(
		createRoute({
			method: "get",
			path: "/cron/monthly",
			description: "Monthly cron job endpoint",
			operationId: "apiCronMonthly",
			responses: {
				200: {
					content: {
						"application/json": {
							schema: CronSchema,
						},
					},
					description: "Monthly cron job executed",
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
					message: "Monthly cron job executed",
				},
				timestamp: new Date(),
			});
		},
	);
};
