import { Effect } from "effect";
import { withFetchFx } from "@/lib/common/fetch";
import { getLoggerFx } from "@/lib/common/log";
import { withFeedSelectFx } from "~/buyer/feed/server/db/withFeedSelectFx";
import type { FeedFilterSchema } from "~/buyer/feed/server/schema/FeedFilterSchema";
import type { FeedQuerySchema } from "~/buyer/feed/server/schema/FeedQuerySchema";

export namespace feedFetchFx {
	export interface Props extends FeedQuerySchema.Type {
		scope: FeedFilterSchema.Type;
	}
}

export const feedFetchFx = Effect.fn("feedFetchFx")(function* ({
	filter,
	where,
	scope,
	sort,
}: feedFetchFx.Props) {
	const logger = yield* getLoggerFx("feedFetchFx");
	logger.trace("feedFetchFx", {
		filter,
		where,
		scope,
		sort,
	});

	return yield* withFetchFx({
		resource: "feed",
		selectFx: withFeedSelectFx({
			sort,
		}),
		filter,
		where,
		scope,
	});
});

export type feedFetchFx = ReturnType<typeof feedFetchFx>;
