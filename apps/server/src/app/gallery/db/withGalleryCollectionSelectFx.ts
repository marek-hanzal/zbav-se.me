import { Effect } from "effect";
import { withGallerySourceSelectFx } from "~/app/gallery/db/withGallerySourceSelectFx";

export namespace withGalleryCollectionSelectFx {
	export interface Props extends withGallerySourceSelectFx.Props {}

	export type Select = Effect.Effect.Success<ReturnType<typeof withGalleryCollectionSelectFx>>;
}

export const withGalleryCollectionSelectFx = Effect.fn("withGalleryCollectionSelectFx")(function* ({
	sort,
}: withGalleryCollectionSelectFx.Props) {
	const sourceSelect = yield* withGallerySourceSelectFx({
		sort,
	});

	return sourceSelect.select("gal.id");
});
