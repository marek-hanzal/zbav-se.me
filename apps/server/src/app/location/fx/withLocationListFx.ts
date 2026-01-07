import { withListFx } from "@use-pico/common/list";
import { Effect } from "effect";
import type { LocationFilterSchema } from "~/app/location/schema/LocationFilterSchema";
import { withLocationQueryBuilderFx } from "../db/withLocationQueryBuilderFx";
import { withLocationSelectFx } from "../db/withLocationSelectFx";
import type { LocationQuerySchema } from "../schema/LocationQuerySchema";

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
