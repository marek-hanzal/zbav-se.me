import { match } from "ts-pattern";
import type { WithDatabase } from "../../../database/WithDatabase";
import type { ListingCartSortSchema } from "../schema/ListingCartSortSchema";

export namespace withListingCartSelect {
	export interface Props {
		database: WithDatabase;
		sort: ListingCartSortSchema.Type[] | undefined;
	}

	export type Select = ReturnType<typeof withListingCartSelect>;
}

export const withListingCartSelect = ({ database, sort }: withListingCartSelect.Props) => {
	let query = database.selectFrom("favorite as f").select([
		"f.id",
		"f.feedId",
		"f.listingId",
		"f.createdAt",
	]);

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("f.createdAt", item.direction))
			.exhaustive();
	}

	return query;
};
