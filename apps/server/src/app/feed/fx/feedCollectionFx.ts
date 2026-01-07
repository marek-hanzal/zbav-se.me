import { withCollectionFx } from "@use-pico/common/collection";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { withFeedCollectionSelectFx } from "~/app/feed/db/withFeedCollectionSelectFx";
import { withFeedQueryBuilderFx } from "~/app/feed/db/withFeedQueryBuilderFx";
import type { FeedFilterSchema } from "~/app/feed/schema/FeedFilterSchema";
import type { FeedQuerySchema } from "~/app/feed/schema/FeedQuerySchema";

export namespace feedCollectionFx {
	export interface Props extends FeedQuerySchema.Type {
		scope: FeedFilterSchema.Type;
	}
}

export const feedCollectionFx = Effect.fn("feedCollectionFx")(function* ({
	filter,
	where,
	scope,
	cursor,
	sort,
}: feedCollectionFx.Props) {
	return yield* withCollectionFx({
		selectFx: withFeedCollectionSelectFx({
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

export type feedCollectionFx = ReturnType<typeof feedCollectionFx>;

