import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withLocationQueryBuilderFx } from "~/client/@session/location/server/db/withLocationQueryBuilderFx";
import { withLocationSelectFx } from "~/client/@session/location/server/db/withLocationSelectFx";
import type { LocationQuerySchema } from "~/client/@session/location/server/schema/LocationQuerySchema";

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
		filter,
		where,
		queryFx: withLocationQueryBuilderFx,
	});
});

export type locationFetchFx = ReturnType<typeof locationFetchFx>;
