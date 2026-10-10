import { Effect } from "effect";
import { dbFx } from "~/database/fx/dbFx";
import { DateServiceFx } from "~/date/service/DateServiceFx";
import { genIdFn } from "~/identity/fn/genIdFn";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { galleryFetchFx } from "~/user-gallery/fx/galleryFetchFx";
import type { GalleryItemCreateSchema } from "~/user-gallery-item/schema/GalleryItemCreateSchema";

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

	const now = dateService.nowFn();
	const id = genIdFn();

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
