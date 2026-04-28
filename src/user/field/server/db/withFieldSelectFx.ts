import { Effect } from "effect";
import { withFieldSourceSelectFx } from "./withFieldSourceSelectFx";

export namespace withFieldSelectFx {
	export interface Props extends withFieldSourceSelectFx.Props {
		//
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withFieldSelectFx>>;
}

export const withFieldSelectFx = Effect.fn("withFieldSelectFx")(function* ({
	sort,
}: withFieldSelectFx.Props) {
	const sourceSelect = yield* withFieldSourceSelectFx({
		sort,
	});

	return sourceSelect.select([
		"fld.id",
		"fld.name",
		"fld.type",
		"fld.required",
	]);
});
