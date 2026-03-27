import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withFeedQueryBuilderFx } from "~/@buyer/feed/server/db/withFeedQueryBuilderFx";
import type { FeedFilterSchema } from "~/@buyer/feed/server/schema/FeedFilterSchema";
import { withFeedFavouriteCollectionSelectFx } from "~/@buyer/feed-favourite/server/db/withFeedFavouriteCollectionSelectFx";
import type { FeedFavouriteCountQuerySchema } from "~/@buyer/feed-favourite/server/schema/FeedFavouriteCountQuerySchema";

export namespace feedFavouriteCountFx {
	export interface Props extends FeedFavouriteCountQuerySchema.Type {
		scope: FeedFilterSchema.Type;
		userId: string;
	}
}

export const feedFavouriteCountFx = Effect.fn("feedFavouriteCountFx")(function* ({
	filter,
	where,
	scope,
	userId,
}: feedFavouriteCountFx.Props) {
	return yield* withCountFx({
		selectFx: withFeedFavouriteCollectionSelectFx({
			userId,
		}),
		filter,
		where,
		scope,
		queryFx: withFeedQueryBuilderFx,
	});
});

export type feedFavouriteCountFx = ReturnType<typeof feedFavouriteCountFx>;
