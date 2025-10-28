import { type ReferenceExpression, sql } from "kysely";
import type { CategoryQuerySchema } from "./schema/CategoryQuerySchema";
import type { withCategorySelect } from "./withCategorySelect";

type LikeMode = "prefix" | "contains";

export function unaccentLike<DB, TB extends keyof DB>(
	column: ReferenceExpression<DB, TB>,
	term: string,
	mode: LikeMode = "prefix",
) {
	return sql<boolean>`lower(unaccent(${column})) like ${
		mode === "prefix"
			? sql`lower(unaccent(${term})) || '%'`
			: sql`'%' || lower(unaccent(${term})) || '%'`
	}`;
}

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

	if (where?.idIn?.length) {
		query = query.where("c.id", "in", where.idIn);
	}

	if (where?.fulltext) {
		const term = where.fulltext;

		query = query.where((eb) =>
			eb.or([
				unaccentLike(eb.ref("c.group"), term, "prefix"),
				unaccentLike(eb.ref("c.category"), term, "prefix"),
				eb.exists(
					eb
						.selectFrom("category_spotlight")
						.select("category_spotlight.categoryId")
						.whereRef("category_spotlight.categoryId", "=", "c.id")
						.where((eb) =>
							unaccentLike(
								eb.ref("category_spotlight.text"),
								term,
								"prefix",
							),
						),
				),
			]),
		);
	}

	if (where?.group) {
		query = query.where((eb) =>
			// biome-ignore lint/style/noNonNullAssertion: We're OK
			unaccentLike(eb.ref("c.group"), where.group!, "prefix"),
		);
	}

	if (where?.category) {
		query = query.where((eb) =>
			// biome-ignore lint/style/noNonNullAssertion: We're OK
			unaccentLike(eb.ref("c.category"), where.category!, "prefix"),
		);
	}

	if (where?.locale) {
		query = query.where("c.locale", "=", where.locale);
	}

	if (where?.localeIn?.length) {
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
				case "group":
					query = query.orderBy("c.group", sortItem.sort);
					break;
				case "category":
					query = query.orderBy("c.category", sortItem.sort);
					break;
				case "sort":
					query = query.orderBy("c.sort", sortItem.sort);
					break;
			}
		}
	}

	return query;
};
