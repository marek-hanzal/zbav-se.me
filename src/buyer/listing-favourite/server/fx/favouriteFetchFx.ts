import { Effect } from "effect";
import { withFavouriteSelectFx } from "~/buyer/listing-favourite/server/db/withFavouriteSelectFx";
import type { FavouriteQuerySchema } from "~/buyer/listing-favourite/server/schema/FavouriteQuerySchema";
import { withFetchFx } from "~/http/fx/withFetchFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import type { FavouriteWhereSchema } from "../schema/FavouriteWhereSchema";

export namespace favouriteFetchFx {
	export interface Props extends FavouriteQuerySchema.Type {
		scope: FavouriteWhereSchema.Type;
	}
}

export const favouriteFetchFx = Effect.fn("favouriteFetchFx")(function* ({
	where,
	scope,
	sort,
}: favouriteFetchFx.Props) {
	const logger = yield* getLoggerFx("favouriteFetchFx", "listing_favourite");
	logger.trace("Request", {
		where,
		scope,
		sort,
	});

	return yield* withFetchFx({
		resource: "listing_favourite",
		selectFx: withFavouriteSelectFx({
			sort,
		}),
		where,
		scope,
	});
});

export type favouriteFetchFx = ReturnType<typeof favouriteFetchFx>;
