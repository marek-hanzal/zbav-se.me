import { Effect } from "effect";
import { withUserRestrictionSourceSelectFx } from "./withUserRestrictionSourceSelectFx";

export namespace withUserRestrictionCollectionSelectFx {
	export interface Props extends withUserRestrictionSourceSelectFx.Props {
		//
	}

	export type Select = Effect.Effect.Success<
		ReturnType<typeof withUserRestrictionCollectionSelectFx>
	>;
}

export const withUserRestrictionCollectionSelectFx = Effect.fn(
	"withUserRestrictionCollectionSelectFx",
)(function* ({ sort }: withUserRestrictionCollectionSelectFx.Props) {
	return yield* withUserRestrictionSourceSelectFx({
		sort,
	});
});
