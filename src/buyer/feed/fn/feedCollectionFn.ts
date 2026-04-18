import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { z } from "zod";
import { zodGuardFx } from "@/lib/common/fx";
import { withLoggerFx } from "@/lib/common/log";
import { feedCollectionFx } from "~/buyer/feed/server/fx/feedCollectionFx";
import { FeedQuerySchema } from "~/buyer/feed/server/schema/FeedQuerySchema";
import { FeedSchema } from "~/buyer/feed/server/schema/FeedSchema";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";

export namespace feedCollectionFn {
	export type Error = Effect.Effect.Error<feedCollectionFx>;
}

export const feedCollectionFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(FeedQuerySchema)
	.handler(async ({ data, context: { database, user, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		return zodGuardFx({
			schema: z.array(FeedSchema),
			dataFx: feedCollectionFx({
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
