import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withFeedQueryBuilderFx } from "~/@buyer/feed/db/withFeedQueryBuilderFx";
import type { FeedFilterSchema } from "~/@buyer/feed/schema/FeedFilterSchema";
import type { FeedQuerySchema } from "~/@buyer/feed/schema/FeedQuerySchema";
import { withFeedFavouriteSelectFx } from "~/@buyer/feed-favourite/db/withFeedFavouriteSelectFx";
import { withTraceFx } from "~/effect/withTraceFx";

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
	yield* withTraceFx({
		fx: "feedFavouriteFetchFx",
		input: {
			filter,
			where,
			scope,
			sort,
		},
	});

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
