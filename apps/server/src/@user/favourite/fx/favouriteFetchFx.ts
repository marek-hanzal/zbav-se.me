import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { FavouriteSchema } from "~/@user/favourite/schema/FavouriteSchema";
import { withFavouriteQueryBuilder } from "~/app/favourite/db/withFavouriteQueryBuilder";
import { withFavouriteSelectFx } from "~/app/favourite/db/withFavouriteSelectFx";
import type { FavouriteQuerySchema } from "~/app/favourite/schema/FavouriteQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace favouriteFetchFx {
	export type Props = FavouriteQuerySchema.Type;
}

export const favouriteFetchFx = Effect.fn("favouriteFetchFx")(function* ({
	filter,
	where,
	sort,
}: favouriteFetchFx.Props) {
	const database = yield* DatabaseContextFx;
	const user = yield* UserContextFx;

	return yield* withFetchFx({
		resource: "favourite",
		select: yield* withFavouriteSelectFx({
			database,
			sort,
		}),
		output: FavouriteSchema,
		filter,
		where: {
			...where,
			userId: user.id,
		},
		query: withFavouriteQueryBuilder,
	});
});

export type favouriteFetchFx = ReturnType<typeof favouriteFetchFx>;
