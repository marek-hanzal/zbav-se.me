import { withListFx } from "@use-pico/common/list";
import { Effect } from "effect";
import { withLocationQueryBuilderFx } from "~/server/@session/location/db/withLocationQueryBuilderFx";
import { withLocationSelectFx } from "~/server/@session/location/db/withLocationSelectFx";
import type { LocationFilterSchema } from "~/server/@session/location/schema/LocationFilterSchema";
import type { LocationQuerySchema } from "~/server/@session/location/schema/LocationQuerySchema";

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
