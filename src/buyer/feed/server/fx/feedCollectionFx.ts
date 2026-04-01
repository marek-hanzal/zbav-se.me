import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { LoggerContextFx } from "@/lib/common/log";
import { withFeedCollectionSelectFx } from "~/buyer/feed/server/db/withFeedCollectionSelectFx";
import { withFeedQueryBuilderFx } from "~/buyer/feed/server/db/withFeedQueryBuilderFx";
import type { FeedFilterSchema } from "~/buyer/feed/server/schema/FeedFilterSchema";
import type { FeedQuerySchema } from "~/buyer/feed/server/schema/FeedQuerySchema";

export namespace feedCollectionFx {
	export interface Props extends FeedQuerySchema.Type {
		scope: FeedFilterSchema.Type;
	}
}

export const feedCollectionFx = Effect.fn("feedCollectionFx")(function* ({
	filter,
	where,
	scope,
	cursor = {
		page: 0,
		size: 10,
	},
	sort,
}: feedCollectionFx.Props) {
	const logger = (yield* LoggerContextFx).getChild("feedCollectionFx");

	logger.trace({
		filter,
		where,
		scope,
		cursor,
		sort,
	});

	return yield* withCollectionFx({
		selectFx: withFeedCollectionSelectFx({
			sort,
		}),
		cursor,
		filter,
		where,
		scope,
		queryFx: withFeedQueryBuilderFx,
	});
});

export type feedCollectionFx = ReturnType<typeof feedCollectionFx>;
