import { Effect } from "effect";
import { withFeedSourceSelectFx } from "~/server/@buyer/feed/db/withFeedSourceSelectFx";
import type { FeedSortSchema } from "~/server/@buyer/feed/schema/FeedSortSchema";

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
