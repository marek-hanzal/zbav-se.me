import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withFavouriteCollectionSelectFx } from "~/@buyer/favourite/server/db/withFavouriteCollectionSelectFx";
import { withFavouriteQueryBuilderFx } from "~/@buyer/favourite/server/db/withFavouriteQueryBuilderFx";
import type { FavouriteFilterSchema } from "~/@buyer/favourite/server/schema/FavouriteFilterSchema";
import type { FavouriteQuerySchema } from "~/@buyer/favourite/server/schema/FavouriteQuerySchema";

export namespace favouriteCollectionFx {
	export interface Props extends FavouriteQuerySchema.Type {
		scope: FavouriteFilterSchema.Type;
	}
}

export const favouriteCollectionFx = Effect.fn("favouriteCollectionFx")(function* ({
	filter,
	where,
	scope,
	cursor,
	sort,
}: favouriteCollectionFx.Props) {
	return yield* withCollectionFx({
		selectFx: withFavouriteCollectionSelectFx({
			sort,
		}),
		cursor: cursor ?? {
			page: 0,
			size: 10,
		},
		filter,
		where,
		scope,
		queryFx: withFavouriteQueryBuilderFx,
	});
});

export type favouriteCollectionFx = ReturnType<typeof favouriteCollectionFx>;
