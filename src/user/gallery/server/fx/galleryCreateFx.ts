import { Effect } from "effect";
import { galleryFetchFx } from "~/user/gallery/server/fx/galleryFetchFx";
import { galleryInsertFx } from "~/user/gallery/server/fx/galleryInsertFx";

export namespace galleryCreateFx {
	export interface Props extends galleryInsertFx.Props {
		//
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
