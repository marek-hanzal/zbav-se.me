import { sql } from "kysely";
import { match } from "ts-pattern";
import { withCategorySelect } from "~/@session/category/db/withCategorySelect";
import type { WithDatabase } from "../../../database/WithDatabase";
import type { CategoryCartSortSchema } from "../schema/CategoryCartSortSchema";

export namespace withCategoryCartSelect {
	export interface Props {
		database: WithDatabase;
		userId: string;
		sort?: CategoryCartSortSchema.Type[];
	}
	export type Select = ReturnType<typeof withCategoryCartSelect>;
}

export const withCategoryCartSelect = ({
	database,
	userId,
	sort,
}: withCategoryCartSelect.Props) => {
	let query = withCategorySelect({
		database,
		/**
		 * Must be undefined and handled in _this_ query because we may
		 * get different order of sorted fields otherwise.
		 */
		sort: undefined,
	})
		.innerJoin(
			database
				.selectFrom("listing_cart as lc")
				.innerJoin("listing as l", "l.id", "lc.listingId")
				.select([
					"l.categoryId as categoryId",
					sql<number>`count(*)::int`.as("listingCount"),
				])
				.where("lc.userId", "=", userId)
				.groupBy("l.categoryId")
				.as("cnt"),
			"cnt.categoryId",
			"cat.id",
		)
		.select("cnt.listingCount");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("group", () => query.orderBy("cat.group", item.direction))
			.with("category", () => query.orderBy("cat.category", item.direction))
			.with("sort", () => query.orderBy("cat.sort", item.direction))
			.with("listingCount", () => query.orderBy("cnt.listingCount", item.direction))
			.exhaustive();
	}

	return query;
};
