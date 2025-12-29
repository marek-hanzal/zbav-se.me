import { createRoute } from "@hono/zod-openapi";
import type { Routes } from "~/hono/Routes";
import { CronSchema } from "./schema/CronSchema";

export const withHourlyEndpoint: Routes.Fn = ({ publicHono }) => {
	publicHono.openapi(
		createRoute({
			method: "get",
			path: "/cron/hourly",
			description: "Hourly cron job endpoint",
			operationId: "apiCronHourly",
			responses: {
				200: {
					content: {
						"application/json": {
							schema: CronSchema,
						},
					},
					description: "Hourly cron job executed",
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
					message: "Hourly cron job executed",
				},
				timestamp: new Date(),
			});
		},
	);
};
