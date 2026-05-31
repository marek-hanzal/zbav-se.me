import { Effect } from "effect";
import { sql } from "kysely";
import { match } from "ts-pattern";
import { selectFx } from "@/lib/common/select";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { withContainsEx } from "~/server/database/expression/withContainsEx";
import type { LocationSortSchema } from "~/session/location/server/schema/LocationSortSchema";
import type { LocationWhereSchema } from "../schema/LocationWhereSchema";

export namespace withLocationSelectFx {
	export interface Props {
		sort?: LocationSortSchema.Type[];
	}
}

export const withLocationSelectFx = Effect.fn("withLocationSelectFx")(function* ({
	sort,
}: withLocationSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let select = kysely.selectFrom("location as loc").select([
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
		select = match(item.field)
			.with("confidence", () => select.orderBy("loc.confidence", item.order))
			.with("query", () => select.orderBy("loc.query", item.order))
			.with("country", () => select.orderBy("loc.country", item.order))
			.with("address", () => select.orderBy("loc.address", item.order))
			.exhaustive();
	}

	return selectFx({
		select,
		queryFx(select, where: LocationWhereSchema.Type) {
			return Effect.gen(function* () {
				let query = select;

				if (!where) {
					return yield* Effect.succeed(select);
				}

				if (where.id) {
					query = query.where("loc.id", "=", where.id);
				}

				if (where.idIn && where.idIn.length > 0) {
					query = query.where("loc.id", "in", where.idIn);
				}

				if (where.fulltext?.length) {
					const term = where.fulltext;
					query = query.where((eb) => {
						return eb.and(
							term.map((value) =>
								eb.or([
									withContainsEx(eb.ref("loc.query"), value),
									withContainsEx(eb.ref("loc.address"), value),
									withContainsEx(eb.ref("loc.country"), value),
									withContainsEx(eb.ref("loc.municipality"), value),
									withContainsEx(eb.ref("loc.state"), value),
									withContainsEx(eb.ref("loc.county"), value),
								]),
							),
						);
					});
				}

				if (where.query) {
					const value = where.query;
					query = query.where((eb) => {
						return eb.or([
							eb("loc.id", "=", value),
							eb("loc.query", "ilike", value),
						]);
					});
				}

				if (where.lang) {
					query = query.where("loc.lang", "=", where.lang);
				}

				if (where.country) {
					query = query.where("loc.country", "=", where.country);
				}

				if (where.code) {
					query = query.where("loc.code", "=", where.code);
				}

				if (where.confidenceMin !== undefined) {
					query = query.where("loc.confidence", ">=", where.confidenceMin);
				}

				return yield* Effect.succeed(query);
			});
		},
	});
});

export type withLocationSelectFx = ReturnType<typeof withLocationSelectFx>;
