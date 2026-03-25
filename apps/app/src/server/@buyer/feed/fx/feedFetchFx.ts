import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withFeedQueryBuilderFx } from "~/server/@buyer/feed/db/withFeedQueryBuilderFx";
import { withFeedSelectFx } from "~/server/@buyer/feed/db/withFeedSelectFx";
import type { FeedFilterSchema } from "~/server/@buyer/feed/schema/FeedFilterSchema";
import type { FeedQuerySchema } from "~/server/@buyer/feed/schema/FeedQuerySchema";

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
