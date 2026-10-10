import { Effect } from "effect";
import { withFavouriteSelectFx } from "~/buyer-listing-favourite/db/withFavouriteSelectFx";
import type { FavouriteCountQuerySchema } from "~/buyer-listing-favourite/schema/FavouriteCountQuerySchema";
import type { FavouriteWhereSchema } from "~/buyer-listing-favourite/schema/FavouriteWhereSchema";
import { withCountFx } from "~/database-query/fx/withCountFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";

export namespace favouriteCountFx {
	export interface Props extends FavouriteCountQuerySchema.Type {
		scope: FavouriteWhereSchema.Type;
	}
}

export const favouriteCountFx = Effect.fn("favouriteCountFx")(function* ({
	where,
	scope,
}: favouriteCountFx.Props) {
	const logger = yield* getLoggerFx("favouriteCountFx");
	logger.trace("favouriteCountFx", {
		where,
		scope,
	});

	return yield* withCountFx({
		selectFx: withFavouriteSelectFx({}),
		where,
		scope,
	});
});

export type favouriteCountFx = ReturnType<typeof favouriteCountFx>;
