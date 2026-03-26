import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withFeedQueryBuilderFx } from "~/server/@buyer/feed/db/withFeedQueryBuilderFx";
import type { FeedFilterSchema } from "~/server/@buyer/feed/schema/FeedFilterSchema";
import type { FeedQuerySchema } from "~/server/@buyer/feed/schema/FeedQuerySchema";
import { withFeedFavouriteSelectFx } from "~/server/@buyer/feed-favourite/db/withFeedFavouriteSelectFx";

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
