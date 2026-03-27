import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withFavouriteQueryBuilderFx } from "~/@buyer/favourite/server/db/withFavouriteQueryBuilderFx";
import { withFavouriteSelectFx } from "~/@buyer/favourite/server/db/withFavouriteSelectFx";
import type { FavouriteFilterSchema } from "~/@buyer/favourite/server/schema/FavouriteFilterSchema";
import type { FavouriteQuerySchema } from "~/@buyer/favourite/server/schema/FavouriteQuerySchema";

export namespace favouriteFetchFx {
	export interface Props extends FavouriteQuerySchema.Type {
		scope: FavouriteFilterSchema.Type;
	}
}

export const favouriteFetchFx = Effect.fn("favouriteFetchFx")(function* ({
	filter,
	where,
	scope,
	sort,
}: favouriteFetchFx.Props) {
	return yield* withFetchFx({
		resource: "favourite",
		selectFx: withFavouriteSelectFx({
			sort,
		}),
		filter,
		where,
		scope,
		queryFx: withFavouriteQueryBuilderFx,
	});
});

export type favouriteFetchFx = ReturnType<typeof favouriteFetchFx>;
