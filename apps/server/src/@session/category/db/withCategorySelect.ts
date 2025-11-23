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
	let query = database.selectFrom("category as cat").selectAll("cat");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("group", () => query.orderBy("cat.group", item.direction))
			.with("category", () => query.orderBy("cat.category", item.direction))
			.with("sort", () => query.orderBy("cat.sort", item.direction))
			.exhaustive();
	}

	return query;
};
