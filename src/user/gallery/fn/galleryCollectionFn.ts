import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { z } from "zod";
import { zodGuardFx } from "@/lib/common/fx";
import { withLoggerFx } from "@/lib/common/log";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { galleryCollectionFx } from "~/user/gallery/server/fx/galleryCollectionFx";
import { GalleryQuerySchema } from "~/user/gallery/server/schema/GalleryQuerySchema";
import { GallerySchema } from "~/user/gallery/server/schema/GallerySchema";

export namespace galleryCollectionFn {
	export type Error = Effect.Effect.Error<galleryCollectionFx>;
}

export const galleryCollectionFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(GalleryQuerySchema)
	.handler(async ({ data, context: { database, user, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		return zodGuardFx({
			schema: z.array(GallerySchema),
			dataFx: galleryCollectionFx({
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
