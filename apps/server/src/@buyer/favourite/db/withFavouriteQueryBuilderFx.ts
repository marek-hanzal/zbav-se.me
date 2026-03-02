import { Effect } from "effect";
import type { withFavouriteSourceSelectFx } from "~/@buyer/favourite/db/withFavouriteSourceSelectFx";
import type { FavouriteFilterSchema } from "~/@buyer/favourite/schema/FavouriteFilterSchema";

export namespace withFavouriteQueryBuilderFx {
	export interface Props<
		TSelect extends withFavouriteSourceSelectFx.Select = withFavouriteSourceSelectFx.Select,
	> {
		select: TSelect;
		where?: FavouriteFilterSchema.Type;
	}

	export type Callback = <TSelect extends withFavouriteSourceSelectFx.Select>(
		props: Props<TSelect>,
	) => TSelect;
}

/**
 * Standalone query builder that applies all filters from FavouriteQuerySchema
 * Can be used by both list and count queries to ensure consistency
 */
export const withFavouriteQueryBuilderFx = Effect.fn("withFavouriteQueryBuilderFx")(function* <
	TSelect extends withFavouriteSourceSelectFx.Select,
>({ select, where }: withFavouriteQueryBuilderFx.Props<TSelect>) {
	if (!where) {
		return yield* Effect.succeed(select);
	}

	let query = select;

	if (where.id) {
		query = query.where("f.id", "=", where.id) as TSelect;
	}

	if (where.idIn && where.idIn.length > 0) {
		query = query.where("f.id", "in", where.idIn) as TSelect;
	}

	if (where.userId) {
		query = query.where("f.userId", "=", where.userId) as TSelect;
	}

	if (where.listingId) {
		query = query.where("f.listingId", "=", where.listingId) as TSelect;
	}

	return yield* Effect.succeed(query);
});
