import { Effect } from "effect";
import { withDraftSourceSelectFx } from "~/app/draft/db/withDraftSourceSelectFx";

export namespace withDraftCollectionSelectFx {
	export interface Props extends withDraftSourceSelectFx.Props {}

	export type Select = Effect.Effect.Success<ReturnType<typeof withDraftCollectionSelectFx>>;
}

export const withDraftCollectionSelectFx = Effect.fn("withDraftCollectionSelectFx")(function* ({
	sort,
}: withDraftCollectionSelectFx.Props) {
	const sourceSelect = yield* withDraftSourceSelectFx({
		sort,
	});

	return sourceSelect.select("d.id");
});
