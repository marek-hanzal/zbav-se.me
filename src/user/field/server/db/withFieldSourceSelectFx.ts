import { Effect } from "effect";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import type { FieldSortSchema } from "~/user/field/server/schema/FieldSortSchema";

export namespace withFieldSourceSelectFx {
	export interface Props {
		sort?: FieldSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withFieldSourceSelectFx>>;
}

export const withFieldSourceSelectFx = Effect.fn("withFieldSourceSelectFx")(function* ({
	sort,
}: withFieldSourceSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let query = kysely.selectFrom("field as fld");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("name", () => query.orderBy("fld.name", item.order))
			.with("type", () => query.orderBy("fld.type", item.order))
			.with("required", () => query.orderBy("fld.required", item.order))
			.exhaustive();
	}

	return query;
});
