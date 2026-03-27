import { Effect } from "effect";
import { withFavouriteSourceSelectFx } from "~/client/@buyer/favourite/server/db/withFavouriteSourceSelectFx";

export namespace withFavouriteCollectionSelectFx {
	export interface Props extends withFavouriteSourceSelectFx.Props {
		//
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withFavouriteCollectionSelectFx>>;
}

export const withFavouriteCollectionSelectFx = Effect.fn("withFavouriteCollectionSelectFx")(
	function* ({ sort }: withFavouriteCollectionSelectFx.Props) {
		const sourceSelect = yield* withFavouriteSourceSelectFx({
			sort,
		});

		return sourceSelect.select("f.id");
	},
);
