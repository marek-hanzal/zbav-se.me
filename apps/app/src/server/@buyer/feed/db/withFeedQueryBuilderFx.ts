import { Effect } from "effect";
import type { withFeedSourceSelectFx } from "~/server/@buyer/feed/db/withFeedSourceSelectFx";
import type { FeedFilterSchema } from "~/server/@buyer/feed/schema/FeedFilterSchema";

export namespace withFeedQueryBuilderFx {
	export interface Props<
		TSelect extends withFeedSourceSelectFx.Select = withFeedSourceSelectFx.Select,
	> {
		select: TSelect;
		where?: FeedFilterSchema.Type;
	}

	export type Callback = <TSelect extends withFeedSourceSelectFx.Select>(
		props: Props<TSelect>,
	) => TSelect;
}

/**
 * Standalone query builder that applies all filters from FeedQuerySchema
 * Can be used by both list and count queries to ensure consistency
 * Generic to support extended select types that extend from withFeedSourceSelectFx.Select
 */
export const withFeedQueryBuilderFx = Effect.fn("withFeedQueryBuilderFx")(function* <
	TSelect extends withFeedSourceSelectFx.Select,
>({ select, where }: withFeedQueryBuilderFx.Props<TSelect>) {
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

	if (where.type) {
		query = query.where("f.type", "=", where.type) as TSelect;
	}

	return yield* Effect.succeed(query);
});
