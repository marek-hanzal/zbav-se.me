import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withFeedQueryBuilderFx } from "~/@buyer-user/feed/db/withFeedQueryBuilderFx";
import { withFeedSelectFx } from "~/@buyer-user/feed/db/withFeedSelectFx";
import type { FeedFilterSchema } from "~/@buyer-user/feed/schema/FeedFilterSchema";
import type { FeedQuerySchema } from "~/@buyer-user/feed/schema/FeedQuerySchema";

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
	yield* Effect.annotateLogsScoped({
		"feedFetchFx.filter": filter,
		"feedFetchFx.where": where,
		"feedFetchFx.scope": scope,
		"feedFetchFx.sort": sort,
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
