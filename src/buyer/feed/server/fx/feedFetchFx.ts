import { Effect } from "effect";
import { withFeedSelectFx } from "~/buyer/feed/server/db/withFeedSelectFx";
import type { FeedQuerySchema } from "~/buyer/feed/server/schema/FeedQuerySchema";
import { withFetchFx } from "~/http/fx/withFetchFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import type { FeedWhereSchema } from "../schema/FeedWhereSchema";

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
