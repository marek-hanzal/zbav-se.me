import { withCollection } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withFavouriteQueryBuilder } from "~/@user/favourite/db/withFavouriteQueryBuilder";
import { withFavouriteSelect } from "~/@user/favourite/db/withFavouriteSelect";
import type { FavouriteQuerySchema } from "~/@user/favourite/schema/FavouriteQuerySchema";
import { FavouriteSchema } from "~/@user/favourite/schema/FavouriteSchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace favouriteCollectionFx {
	export interface Props {
		query: FavouriteQuerySchema.Type;
	}
}

export const favouriteCollectionFx = ({
	query: { cursor, filter, where, sort },
}: favouriteCollectionFx.Props) => {
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
