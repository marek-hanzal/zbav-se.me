import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withLocationQueryBuilderFx } from "~/@session/location/db/withLocationQueryBuilderFx";
import { withLocationSelectFx } from "~/@session/location/db/withLocationSelectFx";
import type { LocationQuerySchema } from "~/@session/location/schema/LocationQuerySchema";
import { withTraceFx } from "~/effect/withTraceFx";

export namespace locationFetchFx {
	export type Props = LocationQuerySchema.Type;
}

export const locationFetchFx = Effect.fn("locationFetchFx")(function* ({
	filter,
	where,
	sort,
}: locationFetchFx.Props) {
	yield* withTraceFx({
		fx: "locationFetchFx",
		input: {
			filter,
			where,
			sort,
		},
	});

	return yield* withFetchFx({
		resource: "location",
		selectFx: withLocationSelectFx({
			sort,
		}),
		filter,
		where,
		queryFx: withLocationQueryBuilderFx,
	});
});

export type locationFetchFx = ReturnType<typeof locationFetchFx>;
