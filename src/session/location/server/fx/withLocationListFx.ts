import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import { withLocationSelectFx } from "~/session/location/server/db/withLocationSelectFx";
import type { LocationQuerySchema } from "~/session/location/server/schema/LocationQuerySchema";
import type { LocationWhereSchema } from "../schema/LocationWhereSchema";

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
