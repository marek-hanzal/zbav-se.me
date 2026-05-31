import { Effect } from "effect";
import { withFetchFx } from "@/lib/common/fetch";
import { getLoggerFx } from "@/lib/common/log";
import { withFavouriteSelectFx } from "~/buyer/favourite/server/db/withFavouriteSelectFx";
import type { FavouriteQuerySchema } from "~/buyer/favourite/server/schema/FavouriteQuerySchema";
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
	const logger = yield* getLoggerFx("favouriteFetchFx", "favourite");
	logger.trace("Request", {
		where,
		scope,
		sort,
	});

	return yield* withFetchFx({
		resource: "favourite",
		selectFx: withFavouriteSelectFx({
			sort,
		}),
		where,
		scope,
	});
});

export type favouriteFetchFx = ReturnType<typeof favouriteFetchFx>;
