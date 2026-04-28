import { Effect } from "effect";
import { withFieldSelectFx } from "./withFieldSelectFx";
import type { withFieldSourceSelectFx } from "./withFieldSourceSelectFx";

export namespace withFieldCollectionSelectFx {
	export interface Props extends withFieldSourceSelectFx.Props {
		//
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withFieldCollectionSelectFx>>;
}

export const withFieldCollectionSelectFx = Effect.fn("withFieldCollectionSelectFx")(function* ({
	sort,
}: withFieldCollectionSelectFx.Props) {
	return yield* withFieldSelectFx({
		sort,
	});
});
