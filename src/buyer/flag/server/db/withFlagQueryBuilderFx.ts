import { Effect } from "effect";
import type { withFlagSourceSelectFx } from "~/buyer/flag/server/db/withFlagSourceSelectFx";
import type { FlagFilterSchema } from "~/buyer/flag/server/schema/FlagFilterSchema";

export namespace withFlagQueryBuilderFx {
	export interface Props<
		TSelect extends withFlagSourceSelectFx.Select = withFlagSourceSelectFx.Select,
	> {
		select: TSelect;
		where?: FlagFilterSchema.Type;
	}

	export type Callback = <TSelect extends withFlagSourceSelectFx.Select>(
		props: Props<TSelect>,
	) => TSelect;
}

/**
 * Standalone query builder that applies all filters from FlagQuerySchema
 * Can be used by both list and count queries to ensure consistency
 */
export const withFlagQueryBuilderFx = Effect.fn("withFlagQueryBuilderFx")(function* <
	TSelect extends withFlagSourceSelectFx.Select,
>({ select, where }: withFlagQueryBuilderFx.Props<TSelect>) {
	let query = select;

	if (!where) {
		return yield* Effect.succeed(select);
	}

	if (where.id) {
		query = query.where("f.id", "=", where.id) as TSelect;
	}

	if (where.idIn && where.idIn.length > 0) {
		query = query.where("f.id", "in", where.idIn) as TSelect;
	}

	if (where.userId) {
		query = query.where("f.userId", "=", where.userId) as TSelect;
	}

	if (where.listingId) {
		query = query.where("f.listingId", "=", where.listingId) as TSelect;
	}

	return yield* Effect.succeed(query);
});
