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
	const sourceSelect = yield* withUserRestrictionSourceSelectFx({
		sort,
	});

	return sourceSelect.select([
		"ur.id",
		"ur.createdAt",
		"ur.restriction",
		"ur.availableAt",
	]);
});
