import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { FavouriteSchema } from "~/@user/favourite/schema/FavouriteSchema";
import { withFavouriteQueryBuilderFx } from "~/app/favourite/db/withFavouriteQueryBuilderFx";
import { withFavouriteSelectFx } from "~/app/favourite/db/withFavouriteSelectFx";
import type { FavouriteQuerySchema } from "~/app/favourite/schema/FavouriteQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";

export namespace favouriteFetchFx {
	export type Props = FavouriteQuerySchema.Type;
}

export const favouriteFetchFx = Effect.fn("favouriteFetchFx")(function* ({
	filter,
	where,
	sort,
}: favouriteFetchFx.Props) {
	const user = yield* UserContextFx;

	return yield* withFetchFx({
		resource: "favourite",
		select: yield* withFavouriteSelectFx({
			sort,
		}),
		output: FavouriteSchema,
		filter,
		where: {
			...where,
			userId: user.id,
		},
		queryFx: withFavouriteQueryBuilderFx,
	});
});

export type favouriteFetchFx = ReturnType<typeof favouriteFetchFx>;
