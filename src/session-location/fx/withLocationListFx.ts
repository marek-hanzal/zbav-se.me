import { Effect } from "effect";
import { withCollectionFx } from "~/database-query/fx/withCollectionFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { withLocationSelectFx } from "~/session-location/db/withLocationSelectFx";
import type { LocationQuerySchema } from "~/session-location/schema/LocationQuerySchema";
import type { LocationWhereSchema } from "~/session-location/schema/LocationWhereSchema";

export namespace withLocationListFx {
	export interface Props extends LocationQuerySchema.Type {
		scope: LocationWhereSchema.Type;
	}
}

export const withLocationListFx = Effect.fn("withLocationListFx")(function* ({
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
		where,
		scope,
		cursor,
		limit,
	});
});

export type withLocationListFx = ReturnType<typeof withLocationListFx>;
