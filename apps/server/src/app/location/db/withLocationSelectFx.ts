import { Effect } from "effect";
import { match } from "ts-pattern";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import type { LocationSortSchema } from "../schema/LocationSortSchema";

export namespace withLocationSelectFx {
	export interface Props {
		sort?: LocationSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withLocationSelectFx>>;
}

export const withLocationSelectFx = Effect.fn("withLocationSelectFx")(function* ({
	sort,
}: withLocationSelectFx.Props) {
	const database = yield* DatabaseContextFx;

	let query = database.selectFrom("location as loc").selectAll("loc");

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
