import { Effect } from "effect";
import { match } from "ts-pattern";
import type { FavouriteSortSchema } from "~/@user/favourite/schema/FavouriteSortSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";

export namespace withFavouriteSourceSelectFx {
	export interface Props {
		sort?: FavouriteSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withFavouriteSourceSelectFx>>;
}

export const withFavouriteSourceSelectFx = Effect.fn("withFavouriteSourceSelectFx")(function* ({
	sort,
}: withFavouriteSourceSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let query = kysely.selectFrom("favourite as f");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("f.createdAt", item.direction))
			.exhaustive();
	}

	return query;
});
