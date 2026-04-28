import { Effect } from "effect";
import type { withFieldSelectFx } from "./withFieldSelectFx";
import type { FieldFilterSchema } from "~/user/field/server/schema/FieldFilterSchema";

export namespace withFieldQueryBuilderFx {
	export interface Props<TSelect extends withFieldSelectFx.Select = withFieldSelectFx.Select> {
		select: TSelect;
		where?: FieldFilterSchema.Type;
	}

	export type Callback = <TSelect extends withFieldSelectFx.Select>(
		props: Props<TSelect>,
	) => TSelect;
}

export const withFieldQueryBuilderFx = Effect.fn("withFieldQueryBuilderFx")(function* <
	TSelect extends withFieldSelectFx.Select,
>({ select, where }: withFieldQueryBuilderFx.Props<TSelect>) {
	let query = select;

	if (!where) {
		return yield* Effect.succeed(select);
	}

	if (where.id) {
		query = query.where("fld.id", "=", where.id) as TSelect;
	}

	if (where.idIn && where.idIn.length > 0) {
		query = query.where("fld.id", "in", where.idIn) as TSelect;
	}

	if (where.name) {
		query = query.where("fld.name", "=", where.name) as TSelect;
	}

	if (where.type) {
		query = query.where("fld.type", "=", where.type) as TSelect;
	}

	if (where.required !== undefined) {
		query = query.where("fld.required", "=", where.required) as TSelect;
	}

	return yield* Effect.succeed(query);
});
