import { Effect } from "effect";
import { galleryItemFetchFx } from "~/user/gallery-item/server/fx/galleryItemFetchFx";
import { galleryItemInsertFx } from "~/user/gallery-item/server/fx/galleryItemInsertFx";

export namespace galleryItemCreateFx {
	export interface Props extends galleryItemInsertFx.Props {
		//
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
