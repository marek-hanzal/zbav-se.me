import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { FavouriteSchema } from "~/@user/favourite/schema/FavouriteSchema";
import { withFavouriteQueryBuilderFx } from "~/app/favourite/db/withFavouriteQueryBuilderFx";
import { withFavouriteSelectFx } from "~/app/favourite/db/withFavouriteSelectFx";
import type { FavouriteQuerySchema } from "~/app/favourite/schema/FavouriteQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
export namespace favouriteCollectionFx {
	export type Props = FavouriteQuerySchema.Type;
}

export const favouriteCollectionFx = Effect.fn("favouriteCollectionFx")(function* ({
	cursor,
	filter,
	where,
	sort,
}: favouriteCollectionFx.Props) {
	const user = yield* UserContextFx;

	return yield* withCollectionFx({
		select: yield* withFavouriteSelectFx({
			sort,
		}),
		output: FavouriteSchema,
		cursor: cursor ?? {
			page: 0,
			size: 10,
		},
		filter,
		where: {
			...where,
			userId: user.id,
		},
		queryFx: withFavouriteQueryBuilderFx,
	});
});

export type favouriteCollectionFx = ReturnType<typeof favouriteCollectionFx>;
