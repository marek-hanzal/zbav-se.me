import { match } from "ts-pattern";
import { database } from "../../../database/kysely";
import type { ListingIgnoreSortSchema } from "../schema/ListingIgnoreSortSchema";

export namespace withListingIgnoreSelect {
	export interface Props {
		sort: ListingIgnoreSortSchema.Type[] | undefined;
	}

	export type Select = ReturnType<typeof withListingIgnoreSelect>;
}

export const withListingIgnoreSelect = ({
	sort,
}: withListingIgnoreSelect.Props) => {
	const query = database.kysely.selectFrom("listing_ignore as li").select([
		"li.id",
		"li.listingId",
	]);

	for (const item of sort ?? []) {
		if (!item.sort) {
			return query;
		}
		const { sort, value } = item;

		return match(value)
			.with("createdAt", () => query.orderBy("li.createdAt", sort))
			.exhaustive();
	}

	return query;
};
