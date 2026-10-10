import { Effect } from "effect";
import { withFeedSelectFx } from "~/buyer-feed/db/withFeedSelectFx";
import type { FeedQuerySchema } from "~/buyer-feed/schema/FeedQuerySchema";
import type { FeedWhereSchema } from "~/buyer-feed/schema/FeedWhereSchema";
import { withFetchFx } from "~/http/fx/withFetchFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";

export namespace feedFetchFx {
	export interface Props extends FeedQuerySchema.Type {
		scope: FeedWhereSchema.Type;
	}
}

export const feedFetchFx = Effect.fn("feedFetchFx")(function* ({
	where,
	scope,
	sort,
}: feedFetchFx.Props) {
	const logger = yield* getLoggerFx("feedFetchFx");
	logger.trace("feedFetchFx", {
		where,
		scope,
		sort,
	});

	return yield* withFetchFx({
		resource: "feed",
		selectFx: withFeedSelectFx({
			sort,
		}),
		where,
		scope,
	});
});

export type feedFetchFx = ReturnType<typeof feedFetchFx>;
