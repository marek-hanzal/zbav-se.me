import { Effect } from "effect";
import { match } from "ts-pattern";
import type { LocationSortSchema } from "~/@session/location/schema/LocationSortSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";

export namespace withLocationSelectFx {
	export interface Props {
		sort?: LocationSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withLocationSelectFx>>;
}

export const withLocationSelectFx = Effect.fn("withLocationSelectFx")(function* ({
	sort,
}: withLocationSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let query = kysely.selectFrom("location as loc").selectAll("loc");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("confidence", () => query.orderBy("loc.confidence", item.direction))
			.with("query", () => query.orderBy("loc.query", item.direction))
			.with("country", () => query.orderBy("loc.country", item.direction))
			.with("address", () => query.orderBy("loc.address", item.direction))
			.exhaustive();
	}

	return query;
});

export type withLocationSelectFx = ReturnType<typeof withLocationSelectFx>;
