import { createRoute } from "@hono/zod-openapi";
import { Effect } from "effect";
import { RoutesContextFx } from "~/routes/context/RoutesContextFx";
import { CronSchema } from "./schema/CronSchema";

export const withHourlyEndpointFx = Effect.fn("withHourlyEndpointFx")(function* () {
	const { publicHono } = yield* RoutesContextFx;

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
			security: [],
			tags: [
				"Cron",
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
});
