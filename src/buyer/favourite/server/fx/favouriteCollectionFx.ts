import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import { withFavouriteSelectFx } from "~/buyer/favourite/server/db/withFavouriteSelectFx";
import type { FavouriteQuerySchema } from "~/buyer/favourite/server/schema/FavouriteQuerySchema";
import type { FavouriteWhereSchema } from "../schema/FavouriteWhereSchema";

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
	const logger = yield* getLoggerFx("favouriteCollectionFx", "favourite");
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
