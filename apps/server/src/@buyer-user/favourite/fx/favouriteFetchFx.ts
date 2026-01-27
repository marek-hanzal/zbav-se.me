import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withFavouriteQueryBuilderFx } from "~/@buyer-user/favourite/db/withFavouriteQueryBuilderFx";
import { withFavouriteSelectFx } from "~/@buyer-user/favourite/db/withFavouriteSelectFx";
import type { FavouriteFilterSchema } from "~/@buyer-user/favourite/schema/FavouriteFilterSchema";
import type { FavouriteQuerySchema } from "~/@buyer-user/favourite/schema/FavouriteQuerySchema";

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
