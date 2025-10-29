import { match } from "ts-pattern";
import { database } from "../database/kysely";
import type { CategoryMissSortSchema } from "./schema/CategoryMissSortSchema";

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

	for (const sortItem of sort ?? []) {
		if (!sortItem.sort) {
			continue;
		}
		const { sort: key, value } = sortItem;

		query = match(value)
			.with("category", () => query.orderBy("cm.category", key))
			.with("count", () => query.orderBy("cm.count", key))
			.with("updatedAt", () => query.orderBy("cm.updatedAt", key))
			.exhaustive();
	}

	return query;
};
