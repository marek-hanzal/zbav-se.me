import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { zodGuardFx } from "@/lib/common/fx";
import { draftGalleryCreateFx } from "~/seller/draft-gallery/server/fx/draftGalleryCreateFx";
import { DraftGalleryCreateSchema } from "~/seller/draft-gallery/server/schema/DraftGalleryCreateSchema";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { GallerySchema } from "~/user/gallery/server/schema/GallerySchema";

export const draftGalleryCreateFn = createServerFn({
	method: "POST",
})
	.middleware([
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(DraftGalleryCreateSchema)
	.handler(async ({ data, context: { database, user } }) => {
		return zodGuardFx({
			schema: GallerySchema,
			dataFx: draftGalleryCreateFx({
				...data,
				userId: user.id,
			}),
		}).pipe(
			withKyselyFx(database),
			withDateFx,
			withCatchFx({
				NotFoundErrorFx() {
					throw new Error("NotFoundError");
				},
				AccessDeniedErrorFx() {
					throw new Error("AccessDeniedError");
				},
				InvalidRequestErrorFx() {
					throw new Error("InvalidRequestError");
				},
				RuntimeErrorFx() {
					throw new Error("RuntimeError");
				},
				ZodErrorFx() {
					throw new Error("ZodError");
				},
			}),
			Effect.runPromise,
		);
	});
