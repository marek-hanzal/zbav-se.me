import type { FeedFilterSchema } from "../schema/FeedFilterSchema";
import type { withFeedSelect } from "./withFeedSelect";

export namespace withFeedQueryBuilder {
	export interface Props {
		select: withFeedSelect.Select;
		where?: FeedFilterSchema.Type;
	}

	export type Callback = (props: Props) => withFeedSelect.Select;
}

/**
 * Standalone query builder that applies all filters from FeedQuerySchema
 * Can be used by both list and count queries to ensure consistency
 */
export const withFeedQueryBuilder: withFeedQueryBuilder.Callback = ({ select, where }) => {
	let query = select;

	if (where?.id) {
		query = query.where("f.id", "=", where.id);
	}

	if (where?.idIn && where.idIn.length > 0) {
		query = query.where("f.id", "in", where.idIn);
	}

	if (where?.userId) {
		query = query.where("f.userId", "=", where.userId);
	}

	return query;
};
