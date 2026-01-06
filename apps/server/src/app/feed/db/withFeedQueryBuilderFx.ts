import { Effect } from "effect";
import type { withFeedCollectionSelectFx } from "~/app/feed/db/withFeedCollectionSelectFx";
import type { FeedFilterSchema } from "~/app/feed/schema/FeedFilterSchema";

export namespace withFeedQueryBuilder {
	export interface Props<
		TSelect extends withFeedCollectionSelectFx.Select = withFeedCollectionSelectFx.Select,
	> {
		select: TSelect;
		where?: FeedFilterSchema.Type;
	}

	export type Callback = <TSelect extends withFeedCollectionSelectFx.Select>(
		props: Props<TSelect>,
	) => TSelect;
}

/**
 * Standalone query builder that applies all filters from FeedQuerySchema
 * Can be used by both list and count queries to ensure consistency
 * Generic to support extended select types that extend from withFeedSelectFx.Select
 */
export const withFeedQueryBuilderFx = Effect.fn("withFeedQueryBuilderFx")(function* <
	TSelect extends withFeedCollectionSelectFx.Select,
>({ select, where }: withFeedQueryBuilder.Props<TSelect>) {
	let query = select;

	if (where?.id) {
		query = query.where("f.id", "=", where.id) as TSelect;
	}

	if (where?.idIn && where.idIn.length > 0) {
		query = query.where("f.id", "in", where.idIn) as TSelect;
	}

	if (where?.userId) {
		query = query.where("f.userId", "=", where.userId) as TSelect;
	}

	return yield* Effect.succeed(query);
});
