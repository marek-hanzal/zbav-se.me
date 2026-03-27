import { Effect } from "effect";
import { withFlagSourceSelectFx } from "~/client/@buyer/flag/server/db/withFlagSourceSelectFx";

export namespace withFlagCollectionSelectFx {
	export interface Props extends withFlagSourceSelectFx.Props {
		//
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withFlagCollectionSelectFx>>;
}

export const withFlagCollectionSelectFx = Effect.fn("withFlagCollectionSelectFx")(function* ({
	sort,
}: withFlagCollectionSelectFx.Props) {
	const sourceSelect = yield* withFlagSourceSelectFx({
		sort,
	});

	return sourceSelect.select("f.id");
});
