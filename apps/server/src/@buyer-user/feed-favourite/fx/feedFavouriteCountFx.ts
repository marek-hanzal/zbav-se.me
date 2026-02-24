import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withFeedQueryBuilderFx } from "~/@buyer-user/feed/db/withFeedQueryBuilderFx";
import type { FeedFilterSchema } from "~/@buyer-user/feed/schema/FeedFilterSchema";
import { withFeedFavouriteCollectionSelectFx } from "~/@buyer-user/feed-favourite/db/withFeedFavouriteCollectionSelectFx";
import type { FeedFavouriteCountQuerySchema } from "~/@buyer-user/feed-favourite/schema/FeedFavouriteCountQuerySchema";

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
