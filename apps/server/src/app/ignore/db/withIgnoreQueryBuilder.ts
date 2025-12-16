import type { IgnoreFilterSchema } from "~/app/ignore/schema/IgnoreFilterSchema";
import type { withIgnoreSelect } from "./withIgnoreSelect";

export namespace withIgnoreQueryBuilder {
	export interface Props {
		select: withIgnoreSelect.Select;
		where?: IgnoreFilterSchema.Type;
	}

	export type Callback = (props: Props) => withIgnoreSelect.Select;
}

/**
 * Standalone query builder that applies all filters from IgnoreQuerySchema
 * Can be used by both list and count queries to ensure consistency
 */
export const withIgnoreQueryBuilder: withIgnoreQueryBuilder.Callback = ({ select, where }) => {
	if (!where) {
		return select;
	}
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

	return query;
};
