import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import { withFavouriteSelectFx } from "~/buyer/listing-favourite/server/db/withFavouriteSelectFx";
import type { FavouriteCountQuerySchema } from "~/buyer/listing-favourite/server/schema/FavouriteCountQuerySchema";
import type { FavouriteWhereSchema } from "../schema/FavouriteWhereSchema";

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
