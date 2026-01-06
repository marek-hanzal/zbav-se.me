import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { LocationSchema } from "~/@session/location/schema/LocationSchema";
import { withLocationQueryBuilderFx } from "../db/withLocationQueryBuilderFx";
import { withLocationSelectFx } from "../db/withLocationSelectFx";
import type { LocationQuerySchema } from "../schema/LocationQuerySchema";

export namespace locationFetchFx {
	export type Props = LocationQuerySchema.Type;
}

export const locationFetchFx = Effect.fn("locationFetchFx")(function* ({
	filter,
	where,
	sort,
}: locationFetchFx.Props) {
	return yield* withFetchFx({
		resource: "location",
		selectFx: withLocationSelectFx({
			sort,
		}),
		output: LocationSchema,
		filter,
		where,
		queryFx: withLocationQueryBuilderFx,
	});
});

export type locationFetchFx = ReturnType<typeof locationFetchFx>;
