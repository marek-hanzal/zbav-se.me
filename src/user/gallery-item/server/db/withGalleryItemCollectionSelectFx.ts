import { Effect } from "effect";
import { withGalleryItemSourceSelectFx } from "~/user/gallery-item/server/db/withGalleryItemSourceSelectFx";

export namespace withGalleryItemCollectionSelectFx {
	export interface Props extends withGalleryItemSourceSelectFx.Props {
		//
	}

	export type Select = Effect.Effect.Success<
		ReturnType<typeof withGalleryItemCollectionSelectFx>
	>;
}

export const withGalleryItemCollectionSelectFx = Effect.fn("withGalleryItemCollectionSelectFx")(
	function* ({ sort }: withGalleryItemCollectionSelectFx.Props) {
		const sourceSelect = yield* withGalleryItemSourceSelectFx({
			sort,
		});

		return sourceSelect.select("gal_item.id");
	},
);
