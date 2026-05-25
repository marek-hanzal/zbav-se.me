import { createFileRoute } from "@tanstack/react-router";
import { Effect } from "effect";
import { withLoggerFx } from "@/lib/common/log";
import type { NoticeSchema } from "@/lib/common/schema";
import { ScheduleSchema } from "~/common/@cron/schema/ScheduleSchema";
import { withCronFx } from "~/common/@cron/server/withCronFx";
import { getRootLogger } from "~/common/log/getRootLogger";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";

const logger = getRootLogger("cron");

export const Route = createFileRoute("/api/cron/$cron")({
	server: {
		middleware: [
			withLogMiddleware,
			withDatabaseMiddleware,
		],
		handlers: {
			async POST({ context: { rootLogger, database }, params: { cron } }) {
				const schedule = ScheduleSchema.default("noop").catch("noop").parse(cron);

				await withCronFx({
					schedule,
				}).pipe(
					withKyselyFx(database),
					withDateFx,
					withLoggerFx(rootLogger),
					Effect.tapError((error) => {
						return Effect.sync(() => {
							logger.error(error._tag, {
								error,
							});
						});
					}),
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
