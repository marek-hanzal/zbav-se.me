import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { zodGuardFx } from "@/lib/common/fx";
import { withLoggerFx } from "@/lib/common/log";
import { feedGalleryCreateFx } from "~/buyer/feed-gallery/server/fx/feedGalleryCreateFx";
import { FeedGalleryCreateSchema } from "~/buyer/feed-gallery/server/schema/FeedGalleryCreateSchema";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { GallerySchema } from "~/user/gallery/server/schema/GallerySchema";

export const feedGalleryCreateFn = createServerFn({
	method: "POST",
})
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(FeedGalleryCreateSchema)
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
			withDateFx,
			withLoggerFx(rootLogger),
			withCatchFx({
				InvalidRequestErrorFx(error) {
					logger.error("InvalidRequestError", {
						message: error.message,
					});
					throw new Error("InvalidRequestErrorFx");
				},
				NotFoundErrorFx(error) {
					logger.error("NotFoundError", {
						message: error.message,
					});
					throw new Error("NotFoundErrorFx");
				},
				AccessDeniedErrorFx(error) {
					logger.error("AccessDeniedError", {
						message: error.message,
					});
					throw new Error("AccessDeniedErrorFx");
				},
				RuntimeErrorFx(error) {
					logger.error("RuntimeError", {
						message: error.message,
						cause: error.cause,
					});
					throw new Error("RuntimeErrorFx");
				},
				ZodErrorFx({ zod, input }) {
					logger.error("ZodErrorFx", {
						zod,
						input,
					});
					throw new Error("ZodErrorFx");
				},
			}),
			Effect.runPromise,
		);
	});
