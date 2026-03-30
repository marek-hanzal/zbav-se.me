import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { CountSchema, zodGuardFx } from "@/lib/common/schema";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { galleryCountFx } from "~/user/gallery/server/fx/galleryCountFx";
import { GalleryCountQuerySchema } from "~/user/gallery/server/schema/GalleryCountQuerySchema";

export const galleryCountFn = createServerFn()
	.middleware([
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(GalleryCountQuerySchema)
	.handler(async ({ data, context: { database, user } }) => {
		return zodGuardFx({
			schema: CountSchema,
			dataFx: galleryCountFx({
				...data,
				scope: {
					userId: user.id,
				},
			}),
		}).pipe(
			withKyselyFx(database),
			withCatchFx({
				ZodErrorFx() {
					throw new Error("ZodError");
				},
			}),
			Effect.runPromise,
		);
	});
