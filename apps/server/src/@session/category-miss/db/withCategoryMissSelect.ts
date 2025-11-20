import { match } from "ts-pattern";
import type { CategoryMissSortSchema } from "~/@session/category-miss/schema/CategoryMissSortSchema";
import type { WithDatabase } from "~/database/WithDatabase";

export namespace withCategoryMissSelect {
	export interface Props {
		database: WithDatabase;
		sort?: CategoryMissSortSchema.Type[];
	}
	export type Select = ReturnType<typeof withCategoryMissSelect>;
}

export const withCategoryMissSelect = ({ database, sort }: withCategoryMissSelect.Props) => {
	let query = database.selectFrom("category_miss as cm").selectAll("cm");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("category", () => query.orderBy("cm.category", item.direction))
			.with("count", () => query.orderBy("cm.count", item.direction))
			.with("updatedAt", () => query.orderBy("cm.updatedAt", item.direction))
			.exhaustive();
	}

	return query;
};
