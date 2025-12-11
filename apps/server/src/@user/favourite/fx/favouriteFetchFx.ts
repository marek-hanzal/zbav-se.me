import { withFetch } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withFavouriteQueryBuilder } from "~/app/favourite/db/withFavouriteQueryBuilder";
import { withFavouriteSelect } from "~/app/favourite/db/withFavouriteSelect";
import type { FavouriteQuerySchema } from "~/@user/favourite/schema/FavouriteQuerySchema";
import { FavouriteSchema } from "~/@user/favourite/schema/FavouriteSchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { NotFoundError } from "~/error/NotFoundError";

export namespace favouriteFetchFx {
	export interface Props {
		query: Omit<FavouriteQuerySchema.Type, "cursor">;
	}
}

export const favouriteFetchFx = ({ query }: favouriteFetchFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		const data = yield* Effect.tryPromise(async () => {
			const { filter, where, sort } = query;

			return withFetch({
				select: withFavouriteSelect({
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

		if (!data) {
			return yield* new NotFoundError({
				resource: "favourite",
				resourceId: "(query)",
				message: "Favourite not found",
			});
		}

		return data;
	});
};

export type favouriteFetchFx = ReturnType<typeof favouriteFetchFx>;
