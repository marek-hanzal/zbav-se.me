import { match } from "ts-pattern";
import { database } from "../../../database/kysely";
import type { ListingScoreSortSchema } from "../schema/ListingScoreSortSchema";

export namespace withListingScoreSelect {
	export interface Props {
		sort: ListingScoreSortSchema.Type[] | undefined;
	}

	export type Select = ReturnType<typeof withListingScoreSelect>;
}

export const withListingScoreSelect = ({
	sort,
}: withListingScoreSelect.Props) => {
	const query = database.kysely.selectFrom("listing_score as ls").select([
		"ls.id",
		"ls.listingId",
		"ls.score",
		"ls.type",
		"ls.createdAt",
	]);

	for (const item of sort ?? []) {
		if (!item.sort) {
			return query;
		}
		const { sort, value } = item;

		return match(value)
			.with("score", () => query.orderBy("ls.score", sort))
			.with("createdAt", () => query.orderBy("ls.createdAt", sort))
			.exhaustive();
	}

	return query;
};
