import { Effect } from "effect";
import { withFavouriteSelectFx } from "~/buyer-listing-favourite/db/withFavouriteSelectFx";
import type { FavouriteQuerySchema } from "~/buyer-listing-favourite/schema/FavouriteQuerySchema";
import type { FavouriteWhereSchema } from "~/buyer-listing-favourite/schema/FavouriteWhereSchema";
import { withCollectionFx } from "~/database-query/fx/withCollectionFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";

export namespace favouriteCollectionFx {
	export interface Props extends FavouriteQuerySchema.Type {
		scope: FavouriteWhereSchema.Type;
	}
}

export const favouriteCollectionFx = Effect.fn("favouriteCollectionFx")(function* ({
	where,
	scope,
	cursor = {
		page: 0,
		size: 10,
	},
	sort,
	limit,
}: favouriteCollectionFx.Props) {
	const logger = yield* getLoggerFx("favouriteCollectionFx", "listing_favourite");
	logger.trace("Request", {
		where,
		scope,
		cursor,
		sort,
		limit,
	});

	return yield* withCollectionFx({
		selectFx: withFavouriteSelectFx({
			sort,
		}),
		cursor,
		where,
		scope,
		limit,
	});
});

export type favouriteCollectionFx = ReturnType<typeof favouriteCollectionFx>;
