import { match } from "ts-pattern";
import { database } from "../../../database/kysely";
import type { CategoryMissSortSchema } from "../schema/CategoryMissSortSchema";

export namespace withCategoryMissSelect {
	export interface Props {
		sort?: CategoryMissSortSchema.Type[];
	}
	export type Select = ReturnType<typeof withCategoryMissSelect>;
}

export const withCategoryMissSelect = ({
	sort,
}: withCategoryMissSelect.Props = {}) => {
	let query = database.kysely
		.selectFrom("category_miss as cm")
		.selectAll("cm");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("category", () =>
				query.orderBy("cm.category", item.direction),
			)
			.with("count", () => query.orderBy("cm.count", item.direction))
			.with("updatedAt", () =>
				query.orderBy("cm.updatedAt", item.direction),
			)
			.exhaustive();
	}

	return query;
};
