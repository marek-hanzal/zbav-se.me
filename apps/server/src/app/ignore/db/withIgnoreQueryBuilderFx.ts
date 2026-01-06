import { Effect } from "effect";
import type { IgnoreFilterSchema } from "~/app/ignore/schema/IgnoreFilterSchema";
import type { withIgnoreSelectFx } from "./withIgnoreSelectFx";

export namespace withIgnoreQueryBuilderFx {
	export interface Props {
		select: withIgnoreSelectFx.Select;
		where?: IgnoreFilterSchema.Type;
	}

	export type Callback = (props: Props) => withIgnoreSelectFx.Select;
}

/**
 * Standalone query builder that applies all filters from IgnoreQuerySchema
 * Can be used by both list and count queries to ensure consistency
 */
export const withIgnoreQueryBuilderFx = Effect.fn("withIgnoreQueryBuilderFx")(function* ({
	select,
	where,
}: withIgnoreQueryBuilderFx.Props) {
	let query = select;

	if (where.id) {
		query = query.where("i.id", "=", where.id);
	}

	if (where.idIn && where.idIn.length > 0) {
		query = query.where("i.id", "in", where.idIn);
	}

	if (where.userId) {
		query = query.where("i.userId", "=", where.userId);
	}

	if (where.listingId) {
		query = query.where("i.listingId", "=", where.listingId);
	}

	return yield* Effect.succeed(query);
});
