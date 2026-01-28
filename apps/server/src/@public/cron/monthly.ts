import { createRoute } from "@hono/zod-openapi";
import { Effect } from "effect";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { CronSchema } from "./schema/CronSchema";

export const withMonthlyEndpointFx = Effect.fn("withMonthlyEndpointFx")(function* () {
	const { publicHono } = yield* RoutesContextFx;

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
			security: [],
			tags: [
				"Cron",
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
});
