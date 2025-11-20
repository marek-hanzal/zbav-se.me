import { sql } from "kysely";
import { match } from "ts-pattern";
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
	let query = database
		.selectFrom("category as c")
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
			"c.id",
		)
		.select([
			"c.id",
			"c.group",
			"c.category",
			"c.slug",
			"c.sort",
			"c.locale",
			"cnt.listingCount",
		]);

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("group", () => query.orderBy("c.group", item.direction))
			.with("category", () => query.orderBy("c.category", item.direction))
			.with("sort", () => query.orderBy("c.sort", item.direction))
			.with("listingCount", () => query.orderBy("cnt.listingCount", item.direction))
			.exhaustive();
	}

	return query;
};
