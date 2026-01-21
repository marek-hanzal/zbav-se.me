import { Effect } from "effect";
import type { IgnoreFilterSchema } from "~/app/ignore/schema/IgnoreFilterSchema";
import type { withIgnoreSourceSelectFx } from "./withIgnoreSourceSelectFx";

export namespace withIgnoreQueryBuilderFx {
	export interface Props<
		TSelect extends withIgnoreSourceSelectFx.Select = withIgnoreSourceSelectFx.Select,
	> {
		select: TSelect;
		where?: IgnoreFilterSchema.Type;
	}

	export type Callback = <TSelect extends withIgnoreSourceSelectFx.Select>(
		props: Props<TSelect>,
	) => TSelect;
}

/**
 * Standalone query builder that applies all filters from IgnoreQuerySchema
 * Can be used by both list and count queries to ensure consistency
 */
export const withIgnoreQueryBuilderFx = Effect.fn("withIgnoreQueryBuilderFx")(function* <
	TSelect extends withIgnoreSourceSelectFx.Select,
>({ select, where }: withIgnoreQueryBuilderFx.Props<TSelect>) {
	let query = select;

	if (!where) {
		return yield* Effect.succeed(select);
	}

	if (where.id) {
		query = query.where("i.id", "=", where.id) as TSelect;
	}

	if (where.idIn && where.idIn.length > 0) {
		query = query.where("i.id", "in", where.idIn) as TSelect;
	}

	if (where.userId) {
		query = query.where("i.userId", "=", where.userId) as TSelect;
	}

	if (where.listingId) {
		query = query.where("i.listingId", "=", where.listingId) as TSelect;
	}

	return yield* Effect.succeed(query);
});
