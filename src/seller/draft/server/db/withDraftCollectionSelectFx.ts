import { Effect } from "effect";
import { withDraftSelectFx } from "~/seller/draft/server/db/withDraftSelectFx";

export namespace withDraftCollectionSelectFx {
	export interface Props extends withDraftSelectFx.Props {}

	export type Select = Effect.Effect.Success<ReturnType<typeof withDraftCollectionSelectFx>>;
}

export const withDraftCollectionSelectFx = Effect.fn("withDraftCollectionSelectFx")(function* ({
	sort,
	userId,
}: withDraftCollectionSelectFx.Props) {
	const sourceSelect = yield* withDraftSelectFx({
		sort,
		userId,
	});

	return sourceSelect;
});
