import { Effect } from "effect";
import { withFeedSourceSelectFx } from "~/@user/feed/db/withFeedSourceSelectFx";

export namespace withFeedCollectionSelectFx {
	export interface Props extends withFeedSourceSelectFx.Props {}

	export type Select = Effect.Effect.Success<ReturnType<typeof withFeedCollectionSelectFx>>;
}

export const withFeedCollectionSelectFx = Effect.fn("withFeedCollectionSelectFx")(function* ({
	sort,
}: withFeedCollectionSelectFx.Props) {
	const sourceSelect = yield* withFeedSourceSelectFx({
		sort,
	});

	return sourceSelect.select("f.id");
});
