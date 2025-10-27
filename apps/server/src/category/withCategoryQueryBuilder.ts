import type { CategoryQuerySchema } from "./schema/CategoryQuerySchema";
import type { withCategorySelect } from "./withCategorySelect";

export namespace withCategoryQueryBuilder {
	export interface Props {
		select: withCategorySelect.Select;
		where?: CategoryQuerySchema.Type["where"];
		sort?: CategoryQuerySchema.Type["sort"];
	}

	export type Callback = (props: Props) => withCategorySelect.Select;
}

/**
 * Standalone query builder that applies all filters from CategoryQuerySchema
 * Can be used by both list and count queries to ensure consistency
 */
export const withCategoryQueryBuilder: withCategoryQueryBuilder.Callback = ({
	select,
	where,
}) => {
	let query = select;

	if (where?.id) {
		query = query.where("c.id", "=", where.id);
	}

	if (where?.idIn && where.idIn.length > 0) {
		query = query.where("c.id", "in", where.idIn);
	}

	if (where?.fulltext) {
		query = query.where((eb) =>
			eb.or([
				eb("c.name", "ilike", `%${where.fulltext}%`),
				eb.exists(
					eb
						.selectFrom("category_spotlight")
						.select("category_spotlight.categoryId")
						.whereRef("category_spotlight.categoryId", "=", "c.id")
						.where(
							"category_spotlight.text",
							"ilike",
							`${where.fulltext}%`,
						),
				),
			]),
		);
	}

	if (where?.name) {
		query = query.where("c.name", "like", `%${where.name}%`);
	}

	if (where?.locale) {
		query = query.where("c.locale", "=", where.locale);
	}

	if (where?.localeIn && where.localeIn.length > 0) {
		query = query.where("c.locale", "in", where.localeIn);
	}

	return query;
};

/**
 * Extended query builder that also handles sorting
 */
export const withCategoryQueryBuilderWithSort = (
	props: withCategoryQueryBuilder.Props,
) => {
	let query = withCategoryQueryBuilder(props);

	// Apply sorting
	for (const sortItem of props.sort ?? []) {
		if (sortItem.sort) {
			switch (sortItem.value) {
				case "name":
					query = query.orderBy("c.name", sortItem.sort);
					break;
				case "sort":
					query = query.orderBy("c.sort", sortItem.sort);
					break;
			}
		}
	}

	return query;
};
