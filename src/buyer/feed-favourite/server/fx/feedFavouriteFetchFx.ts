import { Effect } from "effect";
import { withFetchFx } from "@/lib/common/fetch";
import { getLoggerFx } from "@/lib/common/log";
import { withFeedQueryBuilderFx } from "~/buyer/feed/server/db/withFeedQueryBuilderFx";
import type { FeedFilterSchema } from "~/buyer/feed/server/schema/FeedFilterSchema";
import type { FeedQuerySchema } from "~/buyer/feed/server/schema/FeedQuerySchema";
import { withFeedFavouriteSelectFx } from "~/buyer/feed-favourite/server/db/withFeedFavouriteSelectFx";

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
	const logger = yield* getLoggerFx("feedFavouriteFetchFx");
	logger.debug("feedFavouriteFetchFx", {
		filter,
		where,
		scope,
		sort,
		userId,
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
