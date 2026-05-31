import { Effect } from "effect";
import { withFetchFx } from "@/lib/common/fetch";
import { getLoggerFx } from "@/lib/common/log";
import { withLocationSelectFx } from "~/session/location/server/db/withLocationSelectFx";
import type { LocationQuerySchema } from "~/session/location/server/schema/LocationQuerySchema";

export namespace locationFetchFx {
	export interface Props extends LocationQuerySchema.Type {
		//
	}
}

export const locationFetchFx = Effect.fn("locationFetchFx")(function* ({
	where,
	sort,
}: locationFetchFx.Props) {
	const logger = yield* getLoggerFx("locationFetchFx");
	logger.trace("locationFetchFx", {
		where,
		sort,
	});

	return yield* withFetchFx({
		resource: "location",
		selectFx: withLocationSelectFx({
			sort,
		}),
		where,
	});
});

export type locationFetchFx = ReturnType<typeof locationFetchFx>;
