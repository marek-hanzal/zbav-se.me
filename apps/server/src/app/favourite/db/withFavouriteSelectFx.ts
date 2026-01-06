import { Effect } from "effect";
import { match } from "ts-pattern";
import type { FavouriteSortSchema } from "~/app/favourite/schema/FavouriteSortSchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace withFavouriteSelectFx {
	export interface Props {
		sort: FavouriteSortSchema.Type[] | undefined;
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withFavouriteSelectFx>>;
}

export const withFavouriteSelectFx = Effect.fn("withFavouriteSelectFx")(function* ({
	sort,
}: withFavouriteSelectFx.Props) {
	const database = yield* DatabaseContextFx;
	let query = database.selectFrom("favourite as f").selectAll("f");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("f.createdAt", item.direction))
			.exhaustive();
	}

	return query;
});
