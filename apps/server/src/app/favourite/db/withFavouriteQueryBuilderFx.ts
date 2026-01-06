import { Effect } from "effect";
import type { FavouriteFilterSchema } from "~/app/favourite/schema/FavouriteFilterSchema";
import type { withFavouriteSelectFx } from "./withFavouriteSelectFx";

export namespace withFavouriteQueryBuilderFx {
	export interface Props {
		select: withFavouriteSelectFx.Select;
		where?: FavouriteFilterSchema.Type;
	}

	export type Callback = (props: Props) => withFavouriteSelectFx.Select;
}

/**
 * Standalone query builder that applies all filters from FavouriteQuerySchema
 * Can be used by both list and count queries to ensure consistency
 */
export const withFavouriteQueryBuilderFx = Effect.fn("withFavouriteQueryBuilderFx")(function* ({
	select,
	where,
}: withFavouriteQueryBuilderFx.Props) {
	if (!where) {
		return yield* Effect.succeed(select);
	}

	let query = select;

	if (where.id) {
		query = query.where("f.id", "=", where.id);
	}

	if (where.idIn && where.idIn.length > 0) {
		query = query.where("f.id", "in", where.idIn);
	}

	if (where.userId) {
		query = query.where("f.userId", "=", where.userId);
	}

	if (where.listingId) {
		query = query.where("f.listingId", "=", where.listingId);
	}

	return yield* Effect.succeed(query);
});
