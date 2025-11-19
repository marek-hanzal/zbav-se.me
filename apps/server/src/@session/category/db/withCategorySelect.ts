import { match } from "ts-pattern";
import type { WithDatabase } from "../../../database/WithDatabase";
import type { CategorySortSchema } from "../schema/CategorySortSchema";

export namespace withCategorySelect {
	export interface Props {
		database: WithDatabase;
		sort?: CategorySortSchema.Type[];
	}
	export type Select = ReturnType<typeof withCategorySelect>;
}

export const withCategorySelect = ({ database, sort }: withCategorySelect.Props) => {
	let query = database.selectFrom("category as c").selectAll("c");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("group", () => query.orderBy("c.group", item.direction))
			.with("category", () => query.orderBy("c.category", item.direction))
			.with("sort", () => query.orderBy("c.sort", item.direction))
			.exhaustive();
	}

	return query;
};
