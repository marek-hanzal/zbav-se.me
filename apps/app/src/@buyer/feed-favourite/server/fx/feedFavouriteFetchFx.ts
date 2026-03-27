import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withFeedQueryBuilderFx } from "~/@buyer/feed/server/db/withFeedQueryBuilderFx";
import type { FeedFilterSchema } from "~/@buyer/feed/server/schema/FeedFilterSchema";
import type { FeedQuerySchema } from "~/@buyer/feed/server/schema/FeedQuerySchema";
import { withFeedFavouriteSelectFx } from "~/@buyer/feed-favourite/server/db/withFeedFavouriteSelectFx";

export namespace feedFavouriteFetchFx {
	export interface Props extends FeedQuerySchema.Type {
		scope: FeedFilterSchema.Type;
		userId: string;
	}
}

export const feedFavouriteFetchFx = Effect.fn("feedFavouriteFetchFx")(function* ({
	filter,
	where,
	scope,
	sort,
	userId,
}: feedFavouriteFetchFx.Props) {
	return yield* withFetchFx({
		resource: "feed-favourite",
		selectFx: withFeedFavouriteSelectFx({
			userId,
			sort,
		}),
		filter,
		where,
		scope,
		queryFx: withFeedQueryBuilderFx,
	});
});

export type feedFavouriteFetchFx = ReturnType<typeof feedFavouriteFetchFx>;
