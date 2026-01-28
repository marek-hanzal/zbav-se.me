import { createRoute } from "@hono/zod-openapi";
import { Effect } from "effect";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { CronSchema } from "~/@public/cron/schema/CronSchema";

export const withDay4EndpointFx = Effect.fn("withDay4EndpointFx")(function* () {
	const { publicHono } = yield* RoutesContextFx;

	publicHono.openapi(
		createRoute({
			method: "get",
			path: "/cron/day-4",
			description: "Daily cron job endpoint (hour 4)",
			operationId: "apiCronDay4",
			responses: {
				200: {
					content: {
						"application/json": {
							schema: CronSchema,
						},
					},
					description: "Daily cron job executed (hour 4)",
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
					message: "Daily cron job executed (hour 4)",
				},
				timestamp: new Date(),
			});
		},
	);
});
