import { Effect } from "effect";
import { match } from "ts-pattern";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import type { FieldOptionSortSchema } from "~/user/field-option/server/schema/FieldOptionSortSchema";

export namespace withFieldOptionSourceSelectFx {
	export interface Props {
		sort?: FieldOptionSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withFieldOptionSourceSelectFx>>;
}

export const withFieldOptionSourceSelectFx = Effect.fn("withFieldOptionSourceSelectFx")(function* ({
	sort,
}: withFieldOptionSourceSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let query = kysely.selectFrom("field_option as fopt");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("fieldId", () => query.orderBy("fopt.fieldId", item.order))
			.with("value", () => query.orderBy("fopt.value", item.order))
			.with("sort", () => query.orderBy("fopt.sort", item.order))
			.exhaustive();
	}

	return query;
});
