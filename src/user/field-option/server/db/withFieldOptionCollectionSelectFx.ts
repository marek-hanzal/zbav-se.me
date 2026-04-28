import { Effect } from "effect";
import { withFieldOptionSelectFx } from "./withFieldOptionSelectFx";
import type { withFieldOptionSourceSelectFx } from "./withFieldOptionSourceSelectFx";

export namespace withFieldOptionCollectionSelectFx {
	export interface Props extends withFieldOptionSourceSelectFx.Props {
		//
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withFieldOptionCollectionSelectFx>>;
}

export const withFieldOptionCollectionSelectFx = Effect.fn("withFieldOptionCollectionSelectFx")(function* ({
	sort,
}: withFieldOptionCollectionSelectFx.Props) {
	return yield* withFieldOptionSelectFx({
		sort,
	});
});
