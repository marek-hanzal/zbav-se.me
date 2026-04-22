import { Effect } from "effect";
import { withUserRestrictionSourceSelectFx } from "./withUserRestrictionSourceSelectFx";

export namespace withUserRestrictionSelectFx {
	export interface Props extends withUserRestrictionSourceSelectFx.Props {
		//
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withUserRestrictionSelectFx>>;
}

export const withUserRestrictionSelectFx = Effect.fn("withUserRestrictionSelectFx")(function* ({
	sort,
}: withUserRestrictionSelectFx.Props) {
	return yield* withUserRestrictionSourceSelectFx({
		sort,
	});
});
