import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withLocationQueryBuilderFx } from "~/@session/location/db/withLocationQueryBuilderFx";
import { withLocationSelectFx } from "~/@session/location/db/withLocationSelectFx";
import type { LocationQuerySchema } from "~/@session/location/schema/LocationQuerySchema";
import { LocationSchema } from "~/@session/location/schema/LocationSchema";
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
		select: yield* withLocationSelectFx({
			sort,
		}),
		output: LocationSchema,
		filter,
		where,
		queryFx: withLocationQueryBuilderFx,
	});
});

export type locationFetchFx = ReturnType<typeof locationFetchFx>;
