import { Effect } from "effect";
import { sql } from "kysely";
import { match } from "ts-pattern";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import type { LocationSortSchema } from "~/session/location/server/schema/LocationSortSchema";

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

	let query = kysely.selectFrom("location as loc").select([
		"loc.id",
		"loc.query",
		"loc.lang",
		"loc.country",
		"loc.code",
		"loc.county",
		"loc.municipality",
		"loc.state",
		"loc.address",
		"loc.city",
		"loc.street",
		"loc.zip",
		"loc.hash",
		sql<number>`loc.confidence::float8`.as("confidence"),
		sql<number>`loc.lat::float8`.as("lat"),
		sql<number>`loc.lon::float8`.as("lon"),
		"loc.geo",
	]);

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("confidence", () => query.orderBy("loc.confidence", item.order))
			.with("query", () => query.orderBy("loc.query", item.order))
			.with("country", () => query.orderBy("loc.country", item.order))
			.with("address", () => query.orderBy("loc.address", item.order))
			.exhaustive();
	}

	return query;
});

export type withLocationSelectFx = ReturnType<typeof withLocationSelectFx>;
