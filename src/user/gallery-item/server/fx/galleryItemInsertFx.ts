import { Effect } from "effect";
import { DateServiceFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";
import { galleryFetchFx } from "~/user/gallery/server/fx/galleryFetchFx";
import type { GalleryItemCreateSchema } from "~/user/gallery-item/server/schema/GalleryItemCreateSchema";

export namespace galleryItemInsertFx {
	export interface Props extends GalleryItemCreateSchema.Type {
		userId: string;
		/**
		 * Runs a gallery existence/ownership check (`galleryFetchFx`) before insert.
		 * Keep enabled for external input; disable only in trusted internal flows.
		 */
		check?: boolean;
	}
}

export const galleryItemInsertFx = Effect.fn("galleryItemInsertFx")(function* ({
	userId,
	galleryId,
	check = true,
	...data
}: galleryItemInsertFx.Props) {
	const logger = yield* getLoggerFx("galleryItemInsertFx");
	logger.trace("galleryItemInsertFx", {
		userId,
		galleryId,
		check,
		...data,
	});

	const dateService = yield* DateServiceFx;

	const now = dateService.now();
	const id = genId();

	/**
	 * Just ensures the gallery exists with the correct user
	 */
	if (check) {
		yield* galleryFetchFx({
			where: {
				id: galleryId,
			},
			scope: {
				userId,
			},
		});
	}

	yield* dbFx(async (kysely) => {
		return kysely
			.insertInto("gallery_item")
			.values({
				...data,
				id,
				galleryId,
				createdAt: now.toJSDate(),
			})
			.execute();
	});

	return {
		id,
	} as const;
});

export type galleryItemInsertFx = ReturnType<typeof galleryItemInsertFx>;
