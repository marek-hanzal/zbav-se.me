import { Effect } from "effect";
import { withGallerySelectFx } from "~/server/@user/gallery/db/withGallerySelectFx";
import type { withGallerySourceSelectFx } from "~/server/@user/gallery/db/withGallerySourceSelectFx";

export namespace withGalleryCollectionSelectFx {
	export interface Props extends withGallerySourceSelectFx.Props {
		//
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withGalleryCollectionSelectFx>>;
}

export const withGalleryCollectionSelectFx = Effect.fn("withGalleryCollectionSelectFx")(function* ({
	sort,
}: withGalleryCollectionSelectFx.Props) {
	return yield* withGallerySelectFx({
		sort,
	});
});
