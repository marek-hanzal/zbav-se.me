import { withLikeEx } from "../../../database/expression/withLikeEx";
import type { CategoryFilterSchema } from "../schema/CategoryFilterSchema";
import type { withCategorySelect } from "./withCategorySelect";

export namespace withCategoryQueryBuilder {
	export interface Props<TSelect extends withCategorySelect.Select> {
		select: TSelect;
		where?: CategoryFilterSchema.Type;
	}

	export type Callback<TSelect extends withCategorySelect.Select> = (
		props: Props<TSelect>,
	) => TSelect;
}

/**
 * Standalone query builder that applies all filters from CategoryQuerySchema
 * Can be used by both list and count queries to ensure consistency
 */
export const withCategoryQueryBuilder = <
	TSelect extends withCategorySelect.Select,
>({
	select,
	where,
}: withCategoryQueryBuilder.Props<TSelect>) => {
	if (!where) {
		return select;
	}
	let query: typeof select = select;

	if (where.id) {
		query = query.where("c.id", "=", where.id) as typeof select;
	}

	if (where.idIn && where.idIn.length > 0) {
		query = query.where("c.id", "in", where.idIn) as typeof select;
	}

	if (where.fulltext) {
		const fulltext = where.fulltext;

		query = query.where((eb) =>
			eb.or([
				withLikeEx(eb.ref("c.group"), fulltext),
				withLikeEx(eb.ref("c.category"), fulltext),
				eb.exists(
					eb
						.selectFrom("category_spotlight")
						.select("category_spotlight.categoryId")
						.whereRef("category_spotlight.categoryId", "=", "c.id")
						.where((eb) =>
							withLikeEx(
								eb.ref("category_spotlight.text"),
								fulltext,
							),
						),
				),
			]),
		) as typeof select;
	}

	if (where.group) {
		query = query.where((eb) =>
			withLikeEx(eb.ref("c.group"), where.group),
		) as typeof select;
	}

	if (where.category) {
		query = query.where((eb) =>
			withLikeEx(eb.ref("c.category"), where.category),
		) as typeof select;
	}

	if (where.locale) {
		query = query.where("c.locale", "=", where.locale) as typeof select;
	}

	if (where.localeIn?.length) {
		query = query.where("c.locale", "in", where.localeIn) as typeof select;
	}

	return query;
};
