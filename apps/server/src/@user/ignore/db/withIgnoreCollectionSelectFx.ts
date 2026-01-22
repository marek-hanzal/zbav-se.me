import { Effect } from "effect";
import { withIgnoreSourceSelectFx } from "~/@user/ignore/db/withIgnoreSourceSelectFx";

export namespace withIgnoreCollectionSelectFx {
	export interface Props extends withIgnoreSourceSelectFx.Props {}

	export type Select = Effect.Effect.Success<ReturnType<typeof withIgnoreCollectionSelectFx>>;
}

export const withIgnoreCollectionSelectFx = Effect.fn("withIgnoreCollectionSelectFx")(function* ({
	sort,
}: withIgnoreCollectionSelectFx.Props) {
	const sourceSelect = yield* withIgnoreSourceSelectFx({
		sort,
	});

	return sourceSelect.select("i.id");
});
