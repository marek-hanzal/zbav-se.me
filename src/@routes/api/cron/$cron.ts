import { createFileRoute } from "@tanstack/react-router";
import { Effect } from "effect";
import { withCronFx } from "~/cron/fx/withCronFx";
import { ScheduleSchema } from "~/cron/schema/ScheduleSchema";
import { withKyselyFn } from "~/database/fn/withKyselyFn";
import { withDateServiceFn } from "~/date/fn/withDateServiceFn";
import { withLoggerFn } from "~/log/fn/withLoggerFn";
import type { NoticeSchema } from "~/notice/schema/NoticeSchema";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { withTokenMiddlewareFn } from "~/request-middleware/middleware/withTokenMiddlewareFn";
import { ServerCronSchema } from "~/server-env/schema/ServerCronSchema";

export const Route = createFileRoute("/api/cron/$cron")({
	server: {
		middleware: [
			withLogMiddleware,
			withDatabaseMiddleware,
			withTokenMiddlewareFn({
				async tokenFn() {
					return ServerCronSchema.parse(process.env).SERVER_CRON_TOKEN;
				},
			}),
		],
		handlers: {
			async POST({ context: { rootLogger, database }, params: { cron } }) {
				const schedule = ScheduleSchema.default("noop").catch("noop").parse(cron);

				await withCronFx({
					schedule,
				}).pipe(
					withKyselyFn(database),
					withDateServiceFn(),
					withLoggerFn(rootLogger),
					Effect.runPromise,
				);

				return Response.json({
					type: "info",
					message: `Done [${schedule}]`,
				} satisfies NoticeSchema.Type);
			},
		},
	},
});
