import { createFileRoute } from "@tanstack/react-router";
import { Effect } from "effect";
import { ScheduleSchema } from "~/common/@cron/schema/ScheduleSchema";
import { withCronFx } from "~/common/@cron/server/withCronFx";
import { withDateServiceFx } from "~/date/fx/withDateServiceFx";
import { withLoggerFx } from "~/log/fx/withLoggerFx";
import type { NoticeSchema } from "~/notice/schema/NoticeSchema";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { ServerCronSchema } from "~/server/env/ServerCronSchema";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { withTokenMiddleware } from "~/server/middleware/withTokenMiddleware";

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
