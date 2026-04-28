import { Effect } from "effect";
import type { FieldOptionFilterSchema } from "~/user/field-option/server/schema/FieldOptionFilterSchema";
import type { withFieldOptionSelectFx } from "./withFieldOptionSelectFx";

export namespace withFieldOptionQueryBuilderFx {
	export interface Props<
		TSelect extends withFieldOptionSelectFx.Select = withFieldOptionSelectFx.Select,
	> {
		select: TSelect;
		where?: FieldOptionFilterSchema.Type;
	}

	export type Callback = <TSelect extends withFieldOptionSelectFx.Select>(
		props: Props<TSelect>,
	) => TSelect;
}

export const withFieldOptionQueryBuilderFx = Effect.fn("withFieldOptionQueryBuilderFx")(function* <
	TSelect extends withFieldOptionSelectFx.Select,
>({ select, where }: withFieldOptionQueryBuilderFx.Props<TSelect>) {
	let query = select;

	if (!where) {
		return yield* Effect.succeed(select);
	}

	if (where.id) {
		query = query.where("fopt.fieldId", "=", where.id) as TSelect;
	}

	if (where.idIn && where.idIn.length > 0) {
		query = query.where("fopt.fieldId", "in", where.idIn) as TSelect;
	}

	if (where.fieldId) {
		query = query.where("fopt.fieldId", "=", where.fieldId) as TSelect;
	}

	if (where.value) {
		query = query.where("fopt.value", "=", where.value) as TSelect;
	}

	if (where.sort !== undefined) {
		query = query.where("fopt.sort", "=", where.sort) as TSelect;
	}

	return yield* Effect.succeed(query);
});
