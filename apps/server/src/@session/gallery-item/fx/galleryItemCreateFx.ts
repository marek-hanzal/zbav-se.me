import { DateContextFx } from "@use-pico/common/date";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import type { GalleryItemCreateSchema } from "~/@session/gallery-item/schema/GalleryItemCreateSchema";
import { galleryFetchFx } from "~/@user/gallery/fx/galleryFetchFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { galleryItemFetchFx } from "./galleryItemFetchFx";

export namespace galleryItemCreateFx {
	export interface Props extends GalleryItemCreateSchema.Type {
		userId: string;
	}
}

export const galleryItemCreateFx = Effect.fn("galleryItemCreateFx")(function* ({
	userId,
	galleryId,
	...data
}: galleryItemCreateFx.Props) {
	const { kysely } = yield* KyselyContextFx;
	const dateContext = yield* DateContextFx;

	const now = dateContext.now();
	const id = genId();

	/**
	 * Just ensures the gallery exists with the correct user
	 */
	yield* galleryFetchFx({
		where: {
			id: galleryId,
		},
		scope: {
			userId,
		},
	});

	yield* Effect.promise(async () => {
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

	return yield* galleryItemFetchFx({
		where: {
			id,
		},
		scope: {},
	});
});

export type galleryItemCreateFx = ReturnType<typeof galleryItemCreateFx>;
