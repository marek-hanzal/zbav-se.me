import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { z } from "zod";
import { zodGuardFx } from "@/lib/common/schema";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { galleryCollectionFx } from "~/user/gallery/server/fx/galleryCollectionFx";
import { GalleryQuerySchema } from "~/user/gallery/server/schema/GalleryQuerySchema";
import { GallerySchema } from "~/user/gallery/server/schema/GallerySchema";

export const galleryCollectionFn = createServerFn()
	.middleware([
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(GalleryQuerySchema)
	.handler(async ({ data, context: { database, user } }) => {
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
			withCatchFx({
				ZodErrorFx() {
					throw new Error("ZodError");
				},
			}),
			Effect.runPromise,
		);
	});
