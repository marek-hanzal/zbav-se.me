import { withListFx } from "@use-pico/common/list";
import { Effect } from "effect";
import { LocationSchema } from "~/@session/location/schema/LocationSchema";
import { withLocationQueryBuilderFx } from "../db/withLocationQueryBuilderFx";
import { withLocationSelectFx } from "../db/withLocationSelectFx";
import type { LocationQuerySchema } from "../schema/LocationQuerySchema";

export namespace withLocationListFx {
	export interface Props {
		query: LocationQuerySchema.Type;
	}
}

export const withLocationListFx = Effect.fn("withLocationListFx")(function* ({
	query: { filter, where, cursor, sort },
}: withLocationListFx.Props) {
	return yield* withListFx({
		selectFx: withLocationSelectFx({
			sort,
		}),
		output: LocationSchema,
		filter,
		where,
		cursor,
		queryFx: withLocationQueryBuilderFx,
	});
});

export type withLocationListFx = ReturnType<typeof withLocationListFx>;
