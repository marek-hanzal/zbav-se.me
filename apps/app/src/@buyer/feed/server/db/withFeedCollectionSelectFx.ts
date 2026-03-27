import { Effect } from "effect";
import { withFeedSelectFx } from "~/@buyer/feed/server/db/withFeedSelectFx";
import type { withFeedSourceSelectFx } from "~/@buyer/feed/server/db/withFeedSourceSelectFx";

export namespace withFeedCollectionSelectFx {
	export interface Props extends withFeedSourceSelectFx.Props {
		//
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withFeedCollectionSelectFx>>;
}

export const withFeedCollectionSelectFx = Effect.fn("withFeedCollectionSelectFx")(function* ({
	sort,
}: withFeedCollectionSelectFx.Props) {
	return yield* withFeedSelectFx({
		sort,
	});
});
