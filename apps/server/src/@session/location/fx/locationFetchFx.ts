import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withLocationQueryBuilder } from "~/@session/location/db/withLocationQueryBuilder";
import { withLocationSelect } from "~/@session/location/db/withLocationSelect";
import type { LocationQuerySchema } from "~/@session/location/schema/LocationQuerySchema";
import { LocationSchema } from "~/@session/location/schema/LocationSchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace locationFetchFx {
	export type Props = LocationQuerySchema.Type;
}

export const locationFetchFx = Effect.fn("locationFetchFx")(function* ({
	filter,
	where,
	sort,
}: locationFetchFx.Props) {
	const database = yield* DatabaseContextFx;

	return yield* withFetchFx({
		resource: "location",
		select: withLocationSelect({
			database,
			sort,
		}),
		output: LocationSchema,
		filter,
		where,
		query: withLocationQueryBuilder,
	});
});

export type locationFetchFx = ReturnType<typeof locationFetchFx>;
