import { withFetchFx } from "@use-pico/common/fetch";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { withFavouriteQueryBuilderFx } from "~/app/favourite/db/withFavouriteQueryBuilderFx";
import { withFavouriteSelectFx } from "~/app/favourite/db/withFavouriteSelectFx";
import type { FavouriteFilterSchema } from "~/app/favourite/schema/FavouriteFilterSchema";
import type { FavouriteQuerySchema } from "~/app/favourite/schema/FavouriteQuerySchema";

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
