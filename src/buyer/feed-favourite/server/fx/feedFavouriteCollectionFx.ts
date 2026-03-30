import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { withFeedQueryBuilderFx } from "~/buyer/feed/server/db/withFeedQueryBuilderFx";
import type { FeedFilterSchema } from "~/buyer/feed/server/schema/FeedFilterSchema";
import type { FeedQuerySchema } from "~/buyer/feed/server/schema/FeedQuerySchema";
import { withFeedFavouriteCollectionSelectFx } from "~/buyer/feed-favourite/server/db/withFeedFavouriteCollectionSelectFx";

export namespace feedFavouriteCollectionFx {
	export interface Props extends FeedQuerySchema.Type {
		userId: string;
		scope: FeedFilterSchema.Type;
	}
}

export const feedFavouriteCollectionFx = Effect.fn("feedFavouriteCollectionFx")(function* ({
	userId,
	filter,
	where,
	scope,
	cursor,
	sort,
}: feedFavouriteCollectionFx.Props) {
	return yield* withCollectionFx({
		selectFx: withFeedFavouriteCollectionSelectFx({
			userId,
			sort,
		}),
		cursor: cursor ?? {
			page: 0,
			size: 10,
		},
		filter,
		where,
		scope,
		queryFx: withFeedQueryBuilderFx,
	});
});

export type feedFavouriteCollectionFx = ReturnType<typeof feedFavouriteCollectionFx>;
