import { withCollectionFx } from "@use-pico/common/collection";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { withFavouriteQueryBuilderFx } from "~/app/favourite/db/withFavouriteQueryBuilderFx";
import { withFavouriteSelectFx } from "~/app/favourite/db/withFavouriteSelectFx";
import type { FavouriteFilterSchema } from "~/app/favourite/schema/FavouriteFilterSchema";
import type { FavouriteQuerySchema } from "~/app/favourite/schema/FavouriteQuerySchema";

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
		selectFx: withFavouriteSelectFx({
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
