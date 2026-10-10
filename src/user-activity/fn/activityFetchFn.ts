import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { withKyselyFn } from "~/database/fn/withKyselyFn";
import { withLoggerFn } from "~/log/fn/withLoggerFn";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/request-middleware/middleware/withUserMiddleware";
import { activityFetchFx } from "~/user-activity/fx/activityFetchFx";
import { ActivityQuerySchema } from "~/user-activity/schema/ActivityQuerySchema";
import { ActivitySchema } from "~/user-activity/schema/ActivitySchema";
import { zodGuardFx } from "~/validation/fx/zodGuardFx";

export namespace activityFetchFn {
	export type Error = Effect.Error<activityFetchFx>;
}

export const activityFetchFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.validator(ActivityQuerySchema)
	.handler(async ({ data, context: { database, user, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		return zodGuardFx({
			schema: ActivitySchema,
			dataFx: activityFetchFx({
				...data,
				scope: {
					userId: user.id,
				},
			}),
		}).pipe(
			withKyselyFn(database),
			withLoggerFn(rootLogger),
			Effect.tapError((error) => {
				return Effect.sync(() => {
					logger.error(error._tag, {
						error,
					});
				});
			}),
			Effect.runPromise,
		);
	});
