import { Effect } from "effect";
import { withFetchFx } from "@/lib/common/fetch";
import { getLoggerFx } from "@/lib/common/log";
import { withFavouriteSelectFx } from "~/buyer/favourite/server/db/withFavouriteSelectFx";
import type { FavouriteFilterSchema } from "~/buyer/favourite/server/schema/FavouriteFilterSchema";
import type { FavouriteQuerySchema } from "~/buyer/favourite/server/schema/FavouriteQuerySchema";

export namespace favouriteFetchFx {
	export interface Props extends FavouriteQuerySchema.Type {
		scope: FavouriteFilterSchema.Type;
	}
}

export const favouriteFetchFx = Effect.fn("favouriteFetchFx")(function* ({
	filter,
	where,
	scope,
	sort,
}: favouriteFetchFx.Props) {
	const logger = yield* getLoggerFx("favouriteFetchFx", "favourite");
	logger.trace("Request", {
		filter,
		where,
		scope,
		sort,
	});

	return yield* withFetchFx({
		resource: "favourite",
		selectFx: withFavouriteSelectFx({
			sort,
		}),
		filter,
		where,
		scope,
	});
});

export type favouriteFetchFx = ReturnType<typeof favouriteFetchFx>;
