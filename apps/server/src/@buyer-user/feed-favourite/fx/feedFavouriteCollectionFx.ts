import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withFeedQueryBuilderFx } from "~/@buyer-user/feed/db/withFeedQueryBuilderFx";
import type { FeedFilterSchema } from "~/@buyer-user/feed/schema/FeedFilterSchema";
import type { FeedQuerySchema } from "~/@buyer-user/feed/schema/FeedQuerySchema";
import { withFeedFavouriteCollectionSelectFx } from "~/@buyer-user/feed-favourite/db/withFeedFavouriteCollectionSelectFx";

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
