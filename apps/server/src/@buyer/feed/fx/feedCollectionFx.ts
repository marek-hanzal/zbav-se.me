import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withFeedCollectionSelectFx } from "~/@buyer/feed/db/withFeedCollectionSelectFx";
import { withFeedQueryBuilderFx } from "~/@buyer/feed/db/withFeedQueryBuilderFx";
import type { FeedFilterSchema } from "~/@buyer/feed/schema/FeedFilterSchema";
import type { FeedQuerySchema } from "~/@buyer/feed/schema/FeedQuerySchema";

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
