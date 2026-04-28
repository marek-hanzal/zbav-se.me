import { Effect } from "effect";
import { withFieldOptionSourceSelectFx } from "./withFieldOptionSourceSelectFx";

export namespace withFieldOptionSelectFx {
	export interface Props extends withFieldOptionSourceSelectFx.Props {
		//
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withFieldOptionSelectFx>>;
}

export const withFieldOptionSelectFx = Effect.fn("withFieldOptionSelectFx")(function* ({
	sort,
}: withFieldOptionSelectFx.Props) {
	const sourceSelect = yield* withFieldOptionSourceSelectFx({
		sort,
	});

	return sourceSelect.select([
		"fopt.fieldId",
		"fopt.value",
		"fopt.sort",
	]);
});
