import { createRoute } from "@hono/zod-openapi";
import { Effect } from "effect";
import { RoutesContextFx } from "~/app/routes/RoutesContextFx";
import { CronSchema } from "./schema/CronSchema";

export const withDay20EndpointFx = Effect.fn("withDay20EndpointFx")(function* () {
	const { publicHono } = yield* RoutesContextFx;

	publicHono.openapi(
		createRoute({
			method: "get",
			path: "/cron/day-20",
			description: "Daily cron job endpoint (hour 20)",
			operationId: "apiCronDay20",
			responses: {
				200: {
					content: {
						"application/json": {
							schema: CronSchema,
						},
					},
					description: "Daily cron job executed (hour 20)",
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
					message: "Daily cron job executed (hour 20)",
				},
				timestamp: new Date(),
			});
		},
	);
});
