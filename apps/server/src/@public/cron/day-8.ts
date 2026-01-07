import { createRoute } from "@hono/zod-openapi";
import { Effect } from "effect";
import { RoutesContextFx } from "~/app/routes/RoutesContextFx";
import { CronSchema } from "./schema/CronSchema";

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
			tags: [
				"cron",
				"public",
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
