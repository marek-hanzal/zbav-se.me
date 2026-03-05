import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withFeedQueryBuilderFx } from "~/@buyer/feed/db/withFeedQueryBuilderFx";
import { withFeedSelectFx } from "~/@buyer/feed/db/withFeedSelectFx";
import type { FeedFilterSchema } from "~/@buyer/feed/schema/FeedFilterSchema";
import type { FeedQuerySchema } from "~/@buyer/feed/schema/FeedQuerySchema";
import { traceLogFx } from "~/effect/traceLogFx";

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
	yield* traceLogFx({
		level: "trace",
		message: "feedFetchFx",
		input: {
			filter,
			where,
			scope,
			sort,
		},
	});

	return yield* withFetchFx({
		resource: "feed",
		selectFx: withFeedSelectFx({
			sort,
		}),
		filter,
		where,
		scope,
		queryFx: withFeedQueryBuilderFx,
	});
});

export type feedFetchFx = ReturnType<typeof feedFetchFx>;
