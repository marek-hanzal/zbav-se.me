import type { FlagFilterSchema } from "~/@user/flag/schema/FlagFilterSchema";
import type { withFlagSelect } from "./withFlagSelect";

export namespace withFlagQueryBuilder {
	export interface Props {
		select: withFlagSelect.Select;
		where?: FlagFilterSchema.Type;
	}

	export type Callback = (props: Props) => withFlagSelect.Select;
}

/**
 * Standalone query builder that applies all filters from FlagQuerySchema
 * Can be used by both list and count queries to ensure consistency
 */
export const withFlagQueryBuilder: withFlagQueryBuilder.Callback = ({ select, where }) => {
	if (!where) {
		return select;
	}
	let query = select;

	if (where.id) {
		query = query.where("f.id", "=", where.id);
	}

	if (where.idIn && where.idIn.length > 0) {
		query = query.where("f.id", "in", where.idIn);
	}

	if (where.userId) {
		query = query.where("f.userId", "=", where.userId);
	}

	if (where.listingId) {
		query = query.where("f.listingId", "=", where.listingId);
	}

	return query;
};
