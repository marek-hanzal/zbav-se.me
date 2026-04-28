import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import { withFavouriteSelectFx } from "~/buyer/favourite/server/db/withFavouriteSelectFx";
import type { FavouriteCountQuerySchema } from "~/buyer/favourite/server/schema/FavouriteCountQuerySchema";
import type { FavouriteFilterSchema } from "~/buyer/favourite/server/schema/FavouriteFilterSchema";

export namespace favouriteCountFx {
	export interface Props extends FavouriteCountQuerySchema.Type {
		scope: FavouriteFilterSchema.Type;
	}
}

export const favouriteCountFx = Effect.fn("favouriteCountFx")(function* ({
	filter,
	where,
	scope,
}: favouriteCountFx.Props) {
	const logger = yield* getLoggerFx("favouriteCountFx");
	logger.trace("favouriteCountFx", {
		filter,
		where,
		scope,
	});

	return yield* withCountFx({
		selectFx: withFavouriteSelectFx({}),
		filter,
		where,
		scope,
	});
});

export type favouriteCountFx = ReturnType<typeof favouriteCountFx>;
