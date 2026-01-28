import { createRoute } from "@hono/zod-openapi";
import { Effect } from "effect";
import { RoutesContextFx } from "~/routes/context/RoutesContextFx";
import { CronSchema } from "./schema/CronSchema";

export const withDay16EndpointFx = Effect.fn("withDay16EndpointFx")(function* () {
	const { publicHono } = yield* RoutesContextFx;

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
			security: [],
			tags: [
				"Cron",
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
});
