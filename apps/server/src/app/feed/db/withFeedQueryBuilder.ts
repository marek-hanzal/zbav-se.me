import type { withFeedCollectionSelect } from "~/app/feed/db/withFeedCollectionSelect";
import type { FeedFilterSchema } from "~/app/feed/schema/FeedFilterSchema";

export namespace withFeedQueryBuilder {
	export interface Props<
		TSelect extends withFeedCollectionSelect.Select = withFeedCollectionSelect.Select,
	> {
		select: TSelect;
		where?: FeedFilterSchema.Type;
	}

	export type Callback = <TSelect extends withFeedCollectionSelect.Select>(
		props: Props<TSelect>,
	) => TSelect;
}

/**
 * Standalone query builder that applies all filters from FeedQuerySchema
 * Can be used by both list and count queries to ensure consistency
 * Generic to support extended select types that extend from withFeedSelect.Select
 */
export const withFeedQueryBuilder: withFeedQueryBuilder.Callback = <
	TSelect extends withFeedCollectionSelect.Select,
>({
	select,
	where,
}: withFeedQueryBuilder.Props<TSelect>): TSelect => {
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

	return query;
};
