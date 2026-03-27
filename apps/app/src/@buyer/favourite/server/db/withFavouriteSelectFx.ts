import { Effect } from "effect";
import { withFavouriteSourceSelectFx } from "~/@buyer/favourite/server/db/withFavouriteSourceSelectFx";

export namespace withFavouriteSelectFx {
	export interface Props extends withFavouriteSourceSelectFx.Props {
		//
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withFavouriteSelectFx>>;
}

export const withFavouriteSelectFx = Effect.fn("withFavouriteSelectFx")(function* ({
	sort,
}: withFavouriteSelectFx.Props) {
	const sourceSelect = yield* withFavouriteSourceSelectFx({
		sort,
	});

	return sourceSelect.selectAll("f");
});
