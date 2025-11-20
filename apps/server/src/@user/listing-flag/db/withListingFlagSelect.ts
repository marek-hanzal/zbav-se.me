import { match } from "ts-pattern";
import type { WithDatabase } from "../../../database/WithDatabase";
import type { ListingFlagSortSchema } from "../schema/ListingFlagSortSchema";

export namespace withListingFlagSelect {
	export interface Props {
		database: WithDatabase;
		sort: ListingFlagSortSchema.Type[] | undefined;
	}

	export type Select = ReturnType<typeof withListingFlagSelect>;
}

export const withListingFlagSelect = ({ database, sort }: withListingFlagSelect.Props) => {
	let query = database.selectFrom("listing_flag as lf").select([
		"lf.id",
		"lf.listingId",
	]);

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("lf.createdAt", item.direction))
			.exhaustive();
	}

	return query;
};
