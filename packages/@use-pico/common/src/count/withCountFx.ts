import { Effect } from "effect";
import type { SelectQueryBuilder } from "kysely";
import { zodFx } from "../schema";
import { CountSchema } from "../schema/CountSchema";
import type { FilterSchema } from "../schema/FilterSchema";

export namespace withCountFx {
	export namespace Query {
		export interface Props<
			TSelect extends SelectQueryBuilder<any, any, any>,
			TFilter extends FilterSchema.Type,
		> {
			select: TSelect;
			where?: TFilter;
		}
	}

	export interface Props<
		TSelect extends SelectQueryBuilder<any, any, any>,
		TFilter extends FilterSchema.Type,
	> {
		select: TSelect;
		query?(props: Query.Props<TSelect, TFilter>): TSelect;

		filter?: TFilter;
		where?: TFilter;
	}
}

export const withCountFx = Effect.fn("withCountFx")(function* <
	TSelect extends SelectQueryBuilder<any, any, any>,
	TFilter extends FilterSchema.Type,
>({ select, query = () => select, filter, where }: withCountFx.Props<TSelect, TFilter>) {
	const countTotal = yield* Effect.promise(async () => {
		return await select
			.clearSelect()
			.select((eb) => eb.fn.countAll<number>().as("count"))
			.executeTakeFirstOrThrow();
	});
	const countFilter = yield* Effect.promise(async () => {
		return await query({
			select: query({
				select,
				where,
			}),
			where: filter,
		})
			.clearSelect()
			.select((eb) => eb.fn.countAll<number>().as("count"))
			.executeTakeFirstOrThrow();
	});
	const countWhere = yield* Effect.promise(async () => {
		return await query({
			select,
			where,
		})
			.clearSelect()
			.select((eb) => eb.fn.countAll<number>().as("count"))
			.executeTakeFirstOrThrow();
	});

	return yield* zodFx({
		schema: CountSchema,
		data: {
			total: countTotal.count,
			filter: countFilter.count,
			where: countWhere.count,
		},
	});
});
