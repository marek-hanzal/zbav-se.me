import { Effect } from "effect";
import { withFeedFavouriteSourceSelectFx } from "~/@buyer-user/feed-favourite/db/withFeedFavouriteSourceSelectFx";

export namespace withFeedFavouriteCollectionSelectFx {
	export interface Props extends withFeedFavouriteSourceSelectFx.Props {}

	export type Select = Effect.Effect.Success<
		ReturnType<typeof withFeedFavouriteCollectionSelectFx>
	>;
}

export const withFeedFavouriteCollectionSelectFx = Effect.fn("withFeedFavouriteCollectionSelectFx")(
	function* ({ userId, sort }: withFeedFavouriteCollectionSelectFx.Props) {
		const sourceSelect = yield* withFeedFavouriteSourceSelectFx({
			userId,
			sort,
		});

		return sourceSelect.select("f.id");
	},
);
