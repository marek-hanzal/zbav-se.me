import { createServerFn } from "@tanstack/react-start";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { feedGalleryCreateFx } from "~/server/@buyer/feed-gallery/fx/feedGalleryCreateFx";
import { FeedGalleryCreateSchema } from "~/server/@buyer/feed-gallery/schema/FeedGalleryCreateSchema";
import { GallerySchema } from "~/server/@user/gallery/schema/GallerySchema";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";

export const feedGalleryCreateFn = createServerFn({
	method: "POST",
})
	.middleware([
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(FeedGalleryCreateSchema)
	.handler(async ({ data, context: { database, user } }) =>
		zodGuardFx({
			schema: GallerySchema,
			dataFx: feedGalleryCreateFx({
				...data,
				userId: user.id,
			}),
		}).pipe(
			withKyselyFx(database),
			withDateFx,
			withCatchFx({
				InvalidRequestErrorFx() {
					throw new Error("InvalidRequestErrorFx");
				},
				NotFoundErrorFx() {
					throw new Error("NotFoundErrorFx");
				},
				AccessDeniedErrorFx() {
					throw new Error("AccessDeniedErrorFx");
				},
				RuntimeErrorFx() {
					throw new Error("RuntimeErrorFx");
				},
				ZodErrorFx() {
					throw new Error("ZodErrorFx");
				},
			}),
			Effect.runPromise,
		),
	);
