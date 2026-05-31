import { Effect } from "effect";
import { match } from "ts-pattern";
import { selectFx } from "@/lib/common/select";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import type { FieldOptionSortSchema } from "../schema/FieldOptionSortSchema";
import type { FieldOptionWhereSchema } from "../schema/FieldOptionWhereSchema";

export namespace withFieldOptionSelectFx {
	export interface Props {
		sort?: FieldOptionSortSchema.Type[];
	}
}

export const withFieldOptionSelectFx = Effect.fn("withFieldOptionSelectFx")(function* ({
	sort,
}: withFieldOptionSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let query = kysely.selectFrom("field_option as fopt");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("fieldId", () => query.orderBy("fopt.fieldId", item.order))
			.with("value", () => query.orderBy("fopt.value", item.order))
			.with("sort", () => query.orderBy("fopt.sort", item.order))
			.exhaustive();
	}

	return selectFx({
		select: query.select([
			"fopt.fieldId",
			"fopt.value",
			"fopt.sort",
		]),
		queryFx(select, where: FieldOptionWhereSchema.Type) {
			return Effect.gen(function* () {
				let q = select;

				if (!where) {
					return yield* Effect.succeed(select);
				}

				if (where.id) {
					q = q.where("fopt.fieldId", "=", where.id);
				}

				if (where.idIn && where.idIn.length > 0) {
					q = q.where("fopt.fieldId", "in", where.idIn);
				}

				if (where.fieldId) {
					q = q.where("fopt.fieldId", "=", where.fieldId);
				}

				if (where.value) {
					q = q.where("fopt.value", "=", where.value);
				}

				if (where.sort !== undefined) {
					q = q.where("fopt.sort", "=", where.sort);
				}

				return yield* Effect.succeed(q);
			});
		},
	});
});
