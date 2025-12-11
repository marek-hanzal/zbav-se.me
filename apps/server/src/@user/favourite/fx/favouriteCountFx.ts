import { withCount } from "@use-pico/common/count";
import { Effect } from "effect";
import { withFavouriteQueryBuilder } from "~/@user/favourite/db/withFavouriteQueryBuilder";
import { withFavouriteSelect } from "~/@user/favourite/db/withFavouriteSelect";
import type { FavouriteCountQuerySchema } from "~/@user/favourite/schema/FavouriteCountQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace favouriteCountFx {
	export interface Props {
		query: FavouriteCountQuerySchema.Type;
	}
}

export const favouriteCountFx = ({ query: { filter, where } }: favouriteCountFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		return yield* Effect.tryPromise(async () => {
			return withCount({
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
	});
};

export type favouriteCountFx = ReturnType<typeof favouriteCountFx>;
