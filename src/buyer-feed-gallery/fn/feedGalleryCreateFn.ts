import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { feedGalleryCreateFx } from "~/buyer-feed-gallery/fx/feedGalleryCreateFx";
import { FeedGalleryCreateSchema } from "~/buyer-feed-gallery/schema/FeedGalleryCreateSchema";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withDateServiceFx } from "~/date/fx/withDateServiceFx";
import { withLoggerFx } from "~/log/fx/withLoggerFx";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/request-middleware/middleware/withUserMiddleware";
import { GallerySchema } from "~/user-gallery/schema/GallerySchema";
import { zodGuardFx } from "~/validation/fx/zodGuardFx";

export namespace feedGalleryCreateFn {
	export type Error = Effect.Error<feedGalleryCreateFx>;
}

export const feedGalleryCreateFn = createServerFn({
	method: "POST",
})
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.validator(FeedGalleryCreateSchema)
	.handler(async ({ data, context: { database, user, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		return zodGuardFx({
			schema: GallerySchema,
			dataFx: feedGalleryCreateFx({
				...data,
				userId: user.id,
			}),
		}).pipe(
			withKyselyFx(database),
			withDateServiceFx(),
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
