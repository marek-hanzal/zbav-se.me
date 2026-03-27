import { withListFx } from "@use-pico/common/list";
import { Effect } from "effect";
import { withLocationQueryBuilderFx } from "~/client/@session/location/server/db/withLocationQueryBuilderFx";
import { withLocationSelectFx } from "~/client/@session/location/server/db/withLocationSelectFx";
import type { LocationFilterSchema } from "~/client/@session/location/server/schema/LocationFilterSchema";
import type { LocationQuerySchema } from "~/client/@session/location/server/schema/LocationQuerySchema";

export namespace withLocationListFx {
	export interface Props extends LocationQuerySchema.Type {
		scope: LocationFilterSchema.Type;
	}
}

export const withLocationListFx = Effect.fn("withLocationListFx")(function* ({
	filter,
	where,
	scope,
	cursor,
	sort,
}: withLocationListFx.Props) {
	return yield* withListFx({
		selectFx: withLocationSelectFx({
			sort,
		}),
		filter,
		where,
		scope,
		cursor,
		queryFx: withLocationQueryBuilderFx,
	});
});

export type withLocationListFx = ReturnType<typeof withLocationListFx>;
