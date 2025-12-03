import type { withFeedSelect } from "~/@user/feed/db/withFeedSelect";
import type { FeedFilterSchema } from "~/@user/feed/schema/FeedFilterSchema";

export namespace withFeedQueryBuilder {
	export interface Props<TSelect extends withFeedSelect.Select = withFeedSelect.Select> {
		select: TSelect;
		where?: FeedFilterSchema.Type;
	}

	export type Callback = <TSelect extends withFeedSelect.Select>(
		props: Props<TSelect>,
	) => TSelect;
}

/**
 * Standalone query builder that applies all filters from FeedQuerySchema
 * Can be used by both list and count queries to ensure consistency
 * Generic to support extended select types that extend from withFeedSelect.Select
 */
export const withFeedQueryBuilder: withFeedQueryBuilder.Callback = <
	TSelect extends withFeedSelect.Select,
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
