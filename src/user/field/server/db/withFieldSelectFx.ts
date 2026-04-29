import { Effect } from "effect";
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
			.with("required", () => query.orderBy("fld.required", item.order))
			.exhaustive();
	}

	return selectFx({
		select: query.select([
			"fld.name",
			"fld.type",
			"fld.required",
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
				let q = select;

				if (!where) {
					return yield* Effect.succeed(select);
				}

				if (where.id) {
					q = q.where("fld.name", "=", where.id);
				}

				if (where.idIn && where.idIn.length > 0) {
					q = q.where("fld.name", "in", where.idIn);
				}

				if (where.name) {
					q = q.where("fld.name", "=", where.name);
				}

				if (where.type) {
					q = q.where("fld.type", "=", where.type);
				}

				if (where.required !== undefined) {
					q = q.where("fld.required", "=", where.required);
				}

				return yield* Effect.succeed(q);
			});
		},
	});
});
