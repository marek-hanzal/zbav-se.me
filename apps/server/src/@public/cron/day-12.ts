import { createRoute } from "@hono/zod-openapi";
import { Effect } from "effect";
import { CronSchema } from "~/@public/cron/schema/CronSchema";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";

export const withDay12EndpointFx = Effect.fn("withDay12EndpointFx")(function* () {
	const { publicHono } = yield* RoutesContextFx;

	publicHono.openapi(
		createRoute({
			method: "get",
			path: "/cron/day-12",
			description: "Daily cron job endpoint (hour 12)",
			operationId: "apiCronDay12",
			responses: {
				200: {
					content: {
						"application/json": {
							schema: CronSchema,
						},
					},
					description: "Daily cron job executed (hour 12)",
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
					message: "Daily cron job executed (hour 12)",
				},
				timestamp: new Date(),
			});
		},
	);
});
