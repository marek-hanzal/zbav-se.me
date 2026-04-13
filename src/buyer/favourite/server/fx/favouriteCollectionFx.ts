import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import { withFavouriteCollectionSelectFx } from "~/buyer/favourite/server/db/withFavouriteCollectionSelectFx";
import { withFavouriteQueryBuilderFx } from "~/buyer/favourite/server/db/withFavouriteQueryBuilderFx";
import type { FavouriteFilterSchema } from "~/buyer/favourite/server/schema/FavouriteFilterSchema";
import type { FavouriteQuerySchema } from "~/buyer/favourite/server/schema/FavouriteQuerySchema";

export namespace favouriteCollectionFx {
	export interface Props extends FavouriteQuerySchema.Type {
		scope: FavouriteFilterSchema.Type;
	}
}

export const favouriteCollectionFx = Effect.fn("favouriteCollectionFx")(function* ({
	filter,
	where,
	scope,
	cursor = {
		page: 0,
		size: 10,
	},
	sort,
	limit,
}: favouriteCollectionFx.Props) {
	const logger = yield* getLoggerFx("favouriteCollectionFx");
	logger.debug("favouriteCollectionFx", {
		filter,
		where,
		scope,
		cursor,
		sort,
		limit,
	});

	return yield* withCollectionFx({
		selectFx: withFavouriteCollectionSelectFx({
			sort,
		}),
		cursor,
		filter,
		where,
		scope,
		queryFx: withFavouriteQueryBuilderFx,
		limit,
	});
});

export type favouriteCollectionFx = ReturnType<typeof favouriteCollectionFx>;
