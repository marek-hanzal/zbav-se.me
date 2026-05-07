import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import { withFavouriteSelectFx } from "~/buyer/favourite/server/db/withFavouriteSelectFx";
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
	const logger = yield* getLoggerFx("favouriteCollectionFx", "favourite");
	logger.trace("Request", {
		filter,
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
		filter,
		where,
		scope,
		limit,
	});
});

export type favouriteCollectionFx = ReturnType<typeof favouriteCollectionFx>;
