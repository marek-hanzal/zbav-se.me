import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withTraceFx } from "~/effect/withTraceFx";
import { withFeedCollectionSelectFx } from "~/@buyer-user/feed/db/withFeedCollectionSelectFx";
import { withFeedQueryBuilderFx } from "~/@buyer-user/feed/db/withFeedQueryBuilderFx";
import type { FeedFilterSchema } from "~/@buyer-user/feed/schema/FeedFilterSchema";
import type { FeedQuerySchema } from "~/@buyer-user/feed/schema/FeedQuerySchema";

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
	yield* withTraceFx({
		fx: "feedCollectionFx",
		input: { filter, where, scope, cursor, sort },
	});

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
