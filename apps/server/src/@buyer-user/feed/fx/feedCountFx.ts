import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withFeedCollectionSelectFx } from "~/@buyer-user/feed/db/withFeedCollectionSelectFx";
import { withFeedQueryBuilderFx } from "~/@buyer-user/feed/db/withFeedQueryBuilderFx";
import type { FeedCountQuerySchema } from "~/@buyer-user/feed/schema/FeedCountQuerySchema";
import type { FeedFilterSchema } from "~/@buyer-user/feed/schema/FeedFilterSchema";

export namespace feedCountFx {
	export interface Props extends FeedCountQuerySchema.Type {
		scope: FeedFilterSchema.Type;
	}
}

export const feedCountFx = Effect.fn("feedCountFx")(function* ({
	filter,
	where,
	scope,
	count,
}: feedCountFx.Props) {
	return yield* withCountFx({
		selectFx: withFeedCollectionSelectFx({}),
		filter,
		where,
		scope,
		count,
		queryFx: withFeedQueryBuilderFx,
	});
});

export type feedCountFx = ReturnType<typeof feedCountFx>;
