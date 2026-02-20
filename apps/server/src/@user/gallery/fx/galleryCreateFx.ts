import { Effect } from "effect";
import { galleryFetchFx } from "~/@user/gallery/fx/galleryFetchFx";
import { galleryInsertFx } from "~/@user/gallery/fx/galleryInsertFx";
import type { GalleryCreateSchema } from "~/@user/gallery/schema/GalleryCreateSchema";

export namespace galleryCreateFx {
	export interface Props extends GalleryCreateSchema.Type {
		userId: string;
		id?: string;
	}
}

export const galleryCreateFx = Effect.fn("galleryCreateFx")(function* (
	data: galleryCreateFx.Props,
) {
	const { id } = yield* galleryInsertFx(data);

	return yield* galleryFetchFx({
		where: {
			id,
		},
		scope: {
			userId: data.userId,
		},
	});
});

export type galleryCreateFx = ReturnType<typeof galleryCreateFx>;
