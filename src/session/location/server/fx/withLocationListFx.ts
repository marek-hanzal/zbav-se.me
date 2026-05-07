import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import { withLocationSelectFx } from "~/session/location/server/db/withLocationSelectFx";
import type { LocationFilterSchema } from "~/session/location/server/schema/LocationFilterSchema";
import type { LocationQuerySchema } from "~/session/location/server/schema/LocationQuerySchema";

export namespace withLocationListFx {
	export interface Props extends LocationQuerySchema.Type {
		scope: LocationFilterSchema.Type;
	}
}

export const withLocationListFx = Effect.fn("withLocationListFx")(function* ({
	filter,
	where,
	scope,
	cursor = {
		page: 0,
		size: 30,
	},
	limit,
	sort,
}: withLocationListFx.Props) {
	const logger = yield* getLoggerFx("withLocationListFx");
	logger.trace("withLocationListFx", {
		filter,
		where,
		scope,
		cursor,
		limit,
		sort,
	});

	return yield* withCollectionFx({
		selectFx: withLocationSelectFx({
			sort,
		}),
		filter,
		where,
		scope,
		cursor,
		limit,
	});
});

export type withLocationListFx = ReturnType<typeof withLocationListFx>;
