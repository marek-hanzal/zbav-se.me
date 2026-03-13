import { Effect } from "effect";
import type { SelectQueryBuilder } from "kysely";
import { NotFoundErrorFx } from "../error/NotFoundErrorFx";
import type { FilterSchema } from "../schema/FilterSchema";

export namespace withFetchFx {
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
		TDB,
		TTable extends keyof TDB,
		TOutput,
		TFilter extends FilterSchema.Type,
		TSelectError,
		TSelectContext,
		TQueryError,
		TQueryContext,
	> {
		resource: string;
		selectFx: Effect.Effect<
			SelectQueryBuilder<TDB, TTable, TOutput>,
			TSelectError,
			TSelectContext
		>;
		queryFx?(
			props: Query.Props<SelectQueryBuilder<TDB, TTable, TOutput>, TFilter>,
		): Effect.Effect<SelectQueryBuilder<TDB, TTable, TOutput>, TQueryError, TQueryContext>;

		/**
		 * User-land filters - lowest priority
		 */
		filter?: TFilter;
		/**
		 * User-land filter setting default context (e.g. by objectId, whatever)
		 */
		where?: TFilter;
		/**
		 * Scope is used only by the server - guards against accessing resources outside of the scope (e.g. general userId etc.)
		 */
		scope?: TFilter;
	}
}

export const withFetchFx = Effect.fn("withFetchFx")(function* <
	const TDB,
	const TTable extends keyof TDB,
	const TOutput,
	const TFilter extends FilterSchema.Type,
	const TSelectError,
	const TSelectContext,
	const TQueryError,
	const TQueryContext,
>({
	resource,
	selectFx,
	queryFx = ({ select }) => Effect.succeed(select),
	filter,
	where,
	scope,
}: withFetchFx.Props<
	TDB,
	TTable,
	TOutput,
	TFilter,
	TSelectError,
	TSelectContext,
	TQueryError,
	TQueryContext
>) {
	const layers = [
		filter,
		where,
		scope,
	] as const;

	let qb = yield* selectFx;
	for (const layer of layers) {
		qb = yield* queryFx({
			select: qb,
			where: layer,
		});
	}

	const result = yield* Effect.promise(async () => {
		return qb.limit(1).executeTakeFirst();
	});

	if (!result) {
		return yield* new NotFoundErrorFx({
			resource,
			resourceId: JSON.stringify({
				filter,
				where,
				scope,
			}),
			message: "Resource not found",
		});
	}

	return result;
});
