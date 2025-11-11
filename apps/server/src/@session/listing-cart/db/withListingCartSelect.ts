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
		return match(item.field)
			.with("createdAt", () =>
				query.orderBy("lc.createdAt", item.direction),
			)
			.exhaustive();
	}

	return query;
};
