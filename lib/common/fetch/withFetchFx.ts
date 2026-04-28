import { Effect } from "effect";
import { NotFoundErrorFx } from "../error/NotFoundErrorFx";
import type { FilterSchema } from "../schema/FilterSchema";
import type { selectFx } from "../select";

export namespace withFetchFx {
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
		selectFx: selectFx<
			TDB,
			TTable,
			TOutput,
			TFilter,
			TSelectError,
			TSelectContext,
			TQueryError,
			TQueryContext
		>;
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

	let { select: qb, queryFx } = yield* selectFx;
	for (const layer of layers) {
		qb = yield* queryFx(qb, layer);
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
