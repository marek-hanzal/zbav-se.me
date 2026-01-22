import { Effect } from "effect";
import { match } from "ts-pattern";
import type { FavouriteSortSchema } from "~/@user/favourite/schema/FavouriteSortSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";

export namespace withFavouriteSelectFx {
	export interface Props {
		sort?: FavouriteSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withFavouriteSelectFx>>;
}

export const withFavouriteSelectFx = Effect.fn("withFavouriteSelectFx")(function* ({
	sort,
}: withFavouriteSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let query = kysely.selectFrom("favourite as f").selectAll("f");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("f.createdAt", item.direction))
			.exhaustive();
	}

	return query;
});
