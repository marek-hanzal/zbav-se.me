import { match } from "ts-pattern";
import { database } from "../../../database/kysely";
import type { CategorySortSchema } from "../schema/CategorySortSchema";

export namespace withCategorySelect {
	export interface Props {
		sort?: CategorySortSchema.Type[];
	}
	export type Select = ReturnType<typeof withCategorySelect>;
}

export const withCategorySelect = ({ sort }: withCategorySelect.Props = {}) => {
	let query = database.kysely.selectFrom("category as c").selectAll("c");

	for (const sortItem of sort ?? []) {
		if (!sortItem.sort) {
			continue;
		}
		const { sort: key, value } = sortItem;

		query = match(value)
			.with("group", () => query.orderBy("c.group", key))
			.with("category", () => query.orderBy("c.category", key))
			.with("sort", () => query.orderBy("c.sort", key))
			.exhaustive();
	}

	return query;
};
