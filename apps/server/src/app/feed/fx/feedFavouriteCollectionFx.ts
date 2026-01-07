import { withCollectionFx } from "@use-pico/common/collection";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { withFeedFavouriteSelectFx } from "~/app/feed/db/withFeedFavouriteSelectFx";
import { withFeedQueryBuilderFx } from "~/app/feed/db/withFeedQueryBuilderFx";
import type { FeedFilterSchema } from "~/app/feed/schema/FeedFilterSchema";
import type { FeedQuerySchema } from "~/app/feed/schema/FeedQuerySchema";

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
		selectFx: withFeedFavouriteSelectFx({
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
