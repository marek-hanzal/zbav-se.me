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
	let query = database.selectFrom("listing_cart as lc").select([
		"lc.id",
		"lc.listingId",
		"lc.createdAt",
	]);

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("lc.createdAt", item.direction))
			.exhaustive();
	}

	return query;
};
