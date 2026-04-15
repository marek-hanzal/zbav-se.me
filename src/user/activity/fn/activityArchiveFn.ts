import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { withLoggerFx } from "@/lib/common/log";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { activityArchiveFx } from "~/user/activity/server/fx/activityArchiveFx";
import { ActivityQuerySchema } from "~/user/activity/server/schema/ActivityQuerySchema";

export const activityArchiveFn = createServerFn({
	method: "POST",
})
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(ActivityQuerySchema)
	.handler(async ({ data, context: { database, user, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		return activityArchiveFx({
			...data,
			scope: {
				userId: user.id,
			},
		}).pipe(
			withKyselyFx(database),
			withDateFx,
			withLoggerFx(rootLogger),
			withCatchFx({
				RuntimeErrorFx() {
					throw new Error("RuntimeError");
				},
			}),
			Effect.runPromise,
		);
	});
