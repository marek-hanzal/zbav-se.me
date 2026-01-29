import { createRoute } from "@hono/zod-openapi";
import { Effect } from "effect";
import { CronSchema } from "~/@public/cron/schema/CronSchema";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";

export const withDay8EndpointFx = Effect.fn("withDay8EndpointFx")(function* () {
	const { publicHono } = yield* RoutesContextFx;

	publicHono.openapi(
		createRoute({
			method: "get",
			path: "/cron/day-8",
			description: "Daily cron job endpoint (hour 8)",
			operationId: "apiCronDay8",
			responses: {
				200: {
					content: {
						"application/json": {
							schema: CronSchema,
						},
					},
					description: "Daily cron job executed (hour 8)",
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
					message: "Daily cron job executed (hour 8)",
				},
				timestamp: new Date(),
			});
		},
	);
});
