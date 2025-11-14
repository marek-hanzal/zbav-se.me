import type { CategoryMissFilterSchema } from "../schema/CategoryMissFilterSchema";
import type { withCategoryMissSelect } from "./withCategoryMissSelect";

export namespace withCategoryMissQueryBuilder {
	export interface Props {
		select: withCategoryMissSelect.Select;
		where?: CategoryMissFilterSchema.Type;
	}

	export type Callback = (props: Props) => withCategoryMissSelect.Select;
}

/**
 * Query builder for CategoryMiss operations
 */
export const withCategoryMissQueryBuilder: withCategoryMissQueryBuilder.Callback = ({
	select,
	where,
}) => {
	if (!where) {
		return select;
	}

	let query = select;

	if (where?.id) {
		query = query.where("cm.id", "=", where.id);
	}

	if (where.idIn && where.idIn.length > 0) {
		query = query.where("cm.id", "in", where.idIn);
	}

	if (where?.fulltext) {
		const fulltext = where.fulltext;
		query = query.where((eb) =>
			eb.or([
				eb("cm.category", "ilike", `%${fulltext}%`),
			]),
		);
	}

	if (where?.category) {
		query = query.where("cm.category", "=", where.category);
	}

	return query;
};
