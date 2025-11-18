import { match } from "ts-pattern";
import type { WithDatabase } from "../../../database/WithDatabase";
import type { ListingIgnoreSortSchema } from "../schema/ListingIgnoreSortSchema";

export namespace withListingIgnoreSelect {
	export interface Props {
		database: WithDatabase;
		sort: ListingIgnoreSortSchema.Type[] | undefined;
	}

	export type Select = ReturnType<typeof withListingIgnoreSelect>;
}

export const withListingIgnoreSelect = ({ database, sort }: withListingIgnoreSelect.Props) => {
	let query = database.selectFrom("listing_ignore as li").select([
		"li.id",
		"li.listingId",
	]);

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("li.createdAt", item.direction))
			.exhaustive();
	}

	return query;
};
