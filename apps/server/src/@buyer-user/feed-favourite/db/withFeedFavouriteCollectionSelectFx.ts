import { Effect } from "effect";
import { withFeedFavouriteSelectFx } from "~/@buyer-user/feed-favourite/db/withFeedFavouriteSelectFx";
import type { withFeedFavouriteSourceSelectFx } from "~/@buyer-user/feed-favourite/db/withFeedFavouriteSourceSelectFx";

export namespace withFeedFavouriteCollectionSelectFx {
	export interface Props extends withFeedFavouriteSourceSelectFx.Props {}

	export type Select = Effect.Effect.Success<
		ReturnType<typeof withFeedFavouriteCollectionSelectFx>
	>;
}

export const withFeedFavouriteCollectionSelectFx = Effect.fn("withFeedFavouriteCollectionSelectFx")(
	function* ({ userId, sort }: withFeedFavouriteCollectionSelectFx.Props) {
		const sourceSelect = yield* withFeedFavouriteSelectFx({
			userId,
			sort,
		});

		return sourceSelect.selectAll("f");
	},
);
