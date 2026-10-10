import { createFileRoute } from "@tanstack/react-router";
import { Effect } from "effect";
import { withCronFx } from "~/cron/fx/withCronFx";
import { ScheduleSchema } from "~/cron/schema/ScheduleSchema";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withDateServiceFx } from "~/date/fx/withDateServiceFx";
import { withLoggerFx } from "~/log/fx/withLoggerFx";
import type { NoticeSchema } from "~/notice/schema/NoticeSchema";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { withTokenMiddleware } from "~/request-middleware/middleware/withTokenMiddleware";
import { ServerCronSchema } from "~/server-env/schema/ServerCronSchema";

export const Route = createFileRoute("/api/cron/$cron")({
	server: {
		middleware: [
			withLogMiddleware,
			withDatabaseMiddleware,
			withTokenMiddleware({
				async token() {
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
					withKyselyFx(database),
					withDateServiceFx(),
					withLoggerFx(rootLogger),
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
