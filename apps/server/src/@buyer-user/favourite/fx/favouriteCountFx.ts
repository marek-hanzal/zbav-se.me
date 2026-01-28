import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withFavouriteCollectionSelectFx } from "~/@buyer-user/favourite/db/withFavouriteCollectionSelectFx";
import { withFavouriteQueryBuilderFx } from "~/@buyer-user/favourite/db/withFavouriteQueryBuilderFx";
import type { FavouriteCountQuerySchema } from "~/@buyer-user/favourite/schema/FavouriteCountQuerySchema";
import type { FavouriteFilterSchema } from "~/@buyer-user/favourite/schema/FavouriteFilterSchema";

export namespace favouriteCountFx {
	export interface Props extends FavouriteCountQuerySchema.Type {
		scope: FavouriteFilterSchema.Type;
	}
}

export const favouriteCountFx = Effect.fn("favouriteCountFx")(function* ({
	filter,
	where,
	scope,
}: favouriteCountFx.Props) {
	return yield* withCountFx({
		selectFx: withFavouriteCollectionSelectFx({}),
		filter,
		where,
		scope,
		queryFx: withFavouriteQueryBuilderFx,
	});
});

export type favouriteCountFx = ReturnType<typeof favouriteCountFx>;
