import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withFavouriteQueryBuilderFx } from "~/app/favourite/db/withFavouriteQueryBuilderFx";
import { withFavouriteSelectFx } from "~/app/favourite/db/withFavouriteSelectFx";
import type { FavouriteCountQuerySchema } from "~/app/favourite/schema/FavouriteCountQuerySchema";
import type { FavouriteFilterSchema } from "~/app/favourite/schema/FavouriteFilterSchema";

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
		selectFx: withFavouriteSelectFx({}),
		filter,
		where,
		scope,
		queryFx: withFavouriteQueryBuilderFx,
	});
});

export type favouriteCountFx = ReturnType<typeof favouriteCountFx>;
