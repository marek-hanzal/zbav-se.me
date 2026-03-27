import { DateContextFx } from "@use-pico/common/date";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { galleryFetchFx } from "~/user/gallery/server/fx/galleryFetchFx";
import type { galleryItemCreateFx } from "~/user/gallery-item/server/fx/galleryItemCreateFx";

export namespace galleryItemInsertFx {
	export interface Props extends galleryItemCreateFx.Props {
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
	const { kysely } = yield* KyselyContextFx;
	const dateContext = yield* DateContextFx;

	const now = dateContext.now();
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

	yield* tryDbFx(async () =>
		kysely
			.insertInto("gallery_item")
			.values({
				...data,
				id,
				galleryId,
				createdAt: now.toJSDate(),
			})
			.execute(),
	);

	return {
		id,
	};
});

export type galleryItemInsertFx = ReturnType<typeof galleryItemInsertFx>;
