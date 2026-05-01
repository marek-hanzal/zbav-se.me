import { Effect } from "effect";
import { sql } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { match } from "ts-pattern";
import { selectFx } from "@/lib/common/select";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import type { FieldFilterSchema } from "../schema/FieldFilterSchema";
import type { FieldSortSchema } from "../schema/FieldSortSchema";

export namespace withFieldSelectFx {
	export interface Props {
		sort?: FieldSortSchema.Type[];
	}
}

export const withFieldSelectFx = Effect.fn("withFieldSelectFx")(function* ({
	sort,
}: withFieldSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let query = kysely.selectFrom("field as fld");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("name", () => query.orderBy("fld.name", item.order))
			.with("type", () => query.orderBy("fld.type", item.order))
			.exhaustive();
	}

	return selectFx({
		select: query.select([
			"fld.name",
			"fld.type",
			sql<number | null>`fld.min::float8`.as("min"),
			sql<number | null>`fld.max::float8`.as("max"),
			sql<number | null>`fld.step::float8`.as("step"),
			(eb) => {
				return jsonArrayFrom(
					eb
						.selectFrom("field_option as fo")
						.select([
							"fo.fieldId",
							"fo.value",
							"fo.sort",
						])
						.whereRef("fo.fieldId", "=", "fld.name")
						.orderBy("fo.sort", "asc"),
				).as("options");
			},
		]),
		queryFx(select, where: FieldFilterSchema.Type) {
			return Effect.gen(function* () {
				let query = select;

				if (!where) {
					return yield* Effect.succeed(select);
				}

				if (where.id) {
					query = query.where("fld.name", "=", where.id);
				}

				if (where.idIn && where.idIn.length > 0) {
					query = query.where("fld.name", "in", where.idIn);
				}

				if (where.name) {
					query = query.where("fld.name", "=", where.name);
				}

				if (where.type) {
					query = query.where("fld.type", "=", where.type);
				}

				return yield* Effect.succeed(query);
			});
		},
	});
});
