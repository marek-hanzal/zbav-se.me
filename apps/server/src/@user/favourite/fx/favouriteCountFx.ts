import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withFavouriteQueryBuilder } from "~/app/favourite/db/withFavouriteQueryBuilder";
import { withFavouriteSelect } from "~/app/favourite/db/withFavouriteSelect";
import type { FavouriteCountQuerySchema } from "~/app/favourite/schema/FavouriteCountQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace favouriteCountFx {
	export type Props = FavouriteCountQuerySchema.Type;
}

export const favouriteCountFx = Effect.fn("favouriteCountFx")(function* ({
	filter,
	where,
}: favouriteCountFx.Props) {
	const database = yield* DatabaseContextFx;
	const user = yield* UserContextFx;

	return yield* withCountFx({
		select: withFavouriteSelect({
			database,
			sort: undefined,
		}),
		filter,
		where: {
			...where,
			userId: user.id,
		},
		query: withFavouriteQueryBuilder,
	});
});

export type favouriteCountFx = ReturnType<typeof favouriteCountFx>;
