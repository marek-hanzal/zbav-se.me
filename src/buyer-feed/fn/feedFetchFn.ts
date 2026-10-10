import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { feedFetchFx } from "~/buyer-feed/fx/feedFetchFx";
import { FeedQuerySchema } from "~/buyer-feed/schema/FeedQuerySchema";
import { FeedSchema } from "~/buyer-feed/schema/FeedSchema";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withLoggerFx } from "~/log/fx/withLoggerFx";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/request-middleware/middleware/withUserMiddleware";
import { zodGuardFx } from "~/validation/fx/zodGuardFx";

export namespace feedFetchFn {
	export type Error = Effect.Error<feedFetchFx>;
}

export const feedFetchFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.validator(FeedQuerySchema)
	.handler(async ({ data, context: { database, user, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		return zodGuardFx({
			schema: FeedSchema,
			dataFx: feedFetchFx({
				...data,
				scope: {
					userId: user.id,
				},
			}),
		}).pipe(
			withKyselyFx(database),
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
	});
