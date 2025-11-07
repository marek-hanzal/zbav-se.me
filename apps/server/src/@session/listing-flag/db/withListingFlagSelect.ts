import { match } from "ts-pattern";
import { database } from "../../../database/kysely";
import type { ListingFlagSortSchema } from "../schema/ListingFlagSortSchema";

export namespace withListingFlagSelect {
	export interface Props {
		sort: ListingFlagSortSchema.Type[] | undefined;
	}

	export type Select = ReturnType<typeof withListingFlagSelect>;
}

export const withListingFlagSelect = ({
	sort,
}: withListingFlagSelect.Props) => {
	const query = database.kysely.selectFrom("listing_flag as lf").select([
		"lf.id",
		"lf.listingId",
	]);

	for (const item of sort ?? []) {
		if (!item.sort) {
			return query;
		}
		const { sort, value } = item;

		return match(value)
			.with("createdAt", () => query.orderBy("lf.createdAt", sort))
			.exhaustive();
	}

	return query;
};
