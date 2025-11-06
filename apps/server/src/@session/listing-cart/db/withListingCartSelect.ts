import { match } from "ts-pattern";
import { database } from "../../../database/kysely";
import type { ListingCartSortSchema } from "../schema/ListingCartSortSchema";

export namespace withListingCartSelect {
	export interface Props {
		sort: ListingCartSortSchema.Type[] | undefined;
	}

	export type Select = ReturnType<typeof withListingCartSelect>;
}

export const withListingCartSelect = ({
	sort,
}: withListingCartSelect.Props) => {
	const query = database.kysely.selectFrom("listing_cart as lc").select([
		"lc.id",
		"lc.listingId",
		"lc.createdAt",
	]);

	for (const item of sort ?? []) {
		if (!item.sort) {
			return query;
		}
		const { sort, value } = item;

		return match(value)
			.with("createdAt", () => query.orderBy("lc.createdAt", sort))
			.exhaustive();
	}

	return query;
};
