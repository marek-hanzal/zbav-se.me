import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withFavouriteQueryBuilderFx } from "~/app/favourite/db/withFavouriteQueryBuilderFx";
import { withFavouriteSelectFx } from "~/app/favourite/db/withFavouriteSelectFx";
import type { FavouriteCountQuerySchema } from "~/app/favourite/schema/FavouriteCountQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";

export namespace favouriteCountFx {
	export type Props = FavouriteCountQuerySchema.Type;
}

export const favouriteCountFx = Effect.fn("favouriteCountFx")(function* ({
	filter,
	where,
}: favouriteCountFx.Props) {
	const user = yield* UserContextFx;

	return yield* withCountFx({
		select: yield* withFavouriteSelectFx({}),
		filter,
		where: {
			...where,
			userId: user.id,
		},
		queryFx: withFavouriteQueryBuilderFx,
	});
});

export type favouriteCountFx = ReturnType<typeof favouriteCountFx>;
