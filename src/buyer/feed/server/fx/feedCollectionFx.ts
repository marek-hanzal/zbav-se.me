import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import { withFeedSelectFx } from "~/buyer/feed/server/db/withFeedSelectFx";
import type { FeedQuerySchema } from "~/buyer/feed/server/schema/FeedQuerySchema";
import type { FeedWhereSchema } from "../schema/FeedWhereSchema";

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
