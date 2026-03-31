import { Effect } from "effect";
import { withFeedSourceSelectFx } from "~/buyer/feed/server/db/withFeedSourceSelectFx";
import type { FeedSortSchema } from "~/buyer/feed/server/schema/FeedSortSchema";

export namespace withFeedFavouriteSourceSelectFx {
	export interface Props {
		userId: string;
		sort?: FeedSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withFeedFavouriteSourceSelectFx>>;
}

export const withFeedFavouriteSourceSelectFx = Effect.fn("withFeedFavouriteSourceSelectFx")(
	function* ({ userId, sort }: withFeedFavouriteSourceSelectFx.Props) {
		const feedSourceSelect = yield* withFeedSourceSelectFx({
			sort,
		});

		return feedSourceSelect.where("f.id", "in", (eb) =>
			eb.selectFrom("favourite").select("feedId").where("userId", "=", userId),
		);
	},
);
