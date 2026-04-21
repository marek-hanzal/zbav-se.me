import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import { withFeedCollectionSelectFx } from "~/buyer/feed/server/db/withFeedCollectionSelectFx";
import { withFeedQueryBuilderFx } from "~/buyer/feed/server/db/withFeedQueryBuilderFx";
import type { FeedCountQuerySchema } from "~/buyer/feed/server/schema/FeedCountQuerySchema";
import type { FeedFilterSchema } from "~/buyer/feed/server/schema/FeedFilterSchema";

export namespace feedCountFx {
	export interface Props extends FeedCountQuerySchema.Type {
		scope: FeedFilterSchema.Type;
	}
}

export const feedCountFx = Effect.fn("feedCountFx")(function* ({
	filter,
	where,
	scope,
}: feedCountFx.Props) {
	const logger = yield* getLoggerFx("feedCountFx");
	logger.trace("feedCountFx", {
		filter,
		where,
		scope,
	});

	return yield* withCountFx({
		selectFx: withFeedCollectionSelectFx({}),
		filter,
		where,
		scope,
		queryFx: withFeedQueryBuilderFx,
	});
});

export type feedCountFx = ReturnType<typeof feedCountFx>;
