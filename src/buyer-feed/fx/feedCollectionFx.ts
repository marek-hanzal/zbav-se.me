import { Effect } from "effect";
import { withFeedSelectFx } from "~/buyer-feed/db/withFeedSelectFx";
import type { FeedQuerySchema } from "~/buyer-feed/schema/FeedQuerySchema";
import type { FeedWhereSchema } from "~/buyer-feed/schema/FeedWhereSchema";
import { withCollectionFx } from "~/database-query/fx/withCollectionFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";

export namespace feedCollectionFx {
	export interface Props extends FeedQuerySchema.Type {
		scope: FeedWhereSchema.Type;
	}
}

export const feedCollectionFx = Effect.fn("feedCollectionFx")(function* ({
	where,
	scope,
	cursor = {
		page: 0,
		size: 10,
	},
	sort,
	limit,
}: feedCollectionFx.Props) {
	const logger = yield* getLoggerFx("feedCollectionFx");
	logger.trace("feedCollectionFx", {
		where,
		scope,
		cursor,
		sort,
		limit,
	});

	return yield* withCollectionFx({
		selectFx: withFeedSelectFx({
			sort,
		}),
		cursor,
		where,
		scope,
		limit,
	});
});

export type feedCollectionFx = ReturnType<typeof feedCollectionFx>;
