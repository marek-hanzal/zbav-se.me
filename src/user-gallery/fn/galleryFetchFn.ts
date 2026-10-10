import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withLoggerFx } from "~/log/fx/withLoggerFx";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/request-middleware/middleware/withUserMiddleware";
import { galleryFetchFx } from "~/user-gallery/fx/galleryFetchFx";
import { GalleryQuerySchema } from "~/user-gallery/schema/GalleryQuerySchema";
import { GallerySchema } from "~/user-gallery/schema/GallerySchema";
import { zodGuardFx } from "~/validation/fx/zodGuardFx";

export namespace galleryFetchFn {
	export type Error = Effect.Error<galleryFetchFx>;
}

export const galleryFetchFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.validator(GalleryQuerySchema)
	.handler(async ({ data, context: { database, user, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		return zodGuardFx({
			schema: GallerySchema,
			dataFx: galleryFetchFx({
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
