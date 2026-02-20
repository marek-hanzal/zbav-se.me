import { Effect } from "effect";
import { galleryItemFetchFx } from "~/@user/gallery-item/fx/galleryItemFetchFx";
import { galleryItemInsertFx } from "~/@user/gallery-item/fx/galleryItemInsertFx";
import type { GalleryItemCreateSchema } from "~/@user/gallery-item/schema/GalleryItemCreateSchema";

export namespace galleryItemCreateFx {
	export interface Props extends GalleryItemCreateSchema.Type {
		userId: string;
	}
}

export const galleryItemCreateFx = Effect.fn("galleryItemCreateFx")(function* (
	data: galleryItemCreateFx.Props,
) {
	const { id } = yield* galleryItemInsertFx(data);

	return yield* galleryItemFetchFx({
		where: {
			id,
		},
		scope: {},
	});
});

export type galleryItemCreateFx = ReturnType<typeof galleryItemCreateFx>;
