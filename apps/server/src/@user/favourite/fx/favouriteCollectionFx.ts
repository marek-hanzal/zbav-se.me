import { withCollection } from "@use-pico/common/collection";
import { Effect } from "effect";
import { FavouriteSchema } from "~/@user/favourite/schema/FavouriteSchema";
import { withFavouriteQueryBuilder } from "~/app/favourite/db/withFavouriteQueryBuilder";
import { withFavouriteSelect } from "~/app/favourite/db/withFavouriteSelect";
import type { FavouriteQuerySchema } from "~/app/favourite/schema/FavouriteQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace favouriteCollectionFx {
	export type Props = FavouriteQuerySchema.Type;
}

export const favouriteCollectionFx = (query: favouriteCollectionFx.Props) => {
	const { cursor, filter, where, sort } = query;
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		return yield* Effect.tryPromise(async () => {
			return withCollection({
				select: withFavouriteSelect({
					database,
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
				query: withFavouriteQueryBuilder,
			});
		});
	});
};

export type favouriteCollectionFx = ReturnType<typeof favouriteCollectionFx>;
