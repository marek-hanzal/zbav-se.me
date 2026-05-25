import { createFileRoute } from "@tanstack/react-router";
import { Effect } from "effect";
import type { NoticeSchema } from "@/lib/common/schema";
import { ScheduleSchema } from "~/common/@cron/ScheduleSchema";
import { withCronFx } from "~/common/@cron/withCronFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";

export const Route = createFileRoute("/api/cron/$cron")({
	server: {
		middleware: [
			withDatabaseMiddleware,
		],
		handlers: {
			async POST({ context: { database }, params: { cron } }) {
				const schedule = ScheduleSchema.default("noop").catch("noop").parse(cron);

				await withCronFx({
					schedule,
				}).pipe(withKyselyFx(database), Effect.runPromise);

				return Response.json({
					type: "info",
					message: `Done [${schedule}]`,
				} satisfies NoticeSchema.Type);
			},
		},
	},
});
