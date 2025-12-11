import { match } from "ts-pattern";
import type { WithDatabase } from "~/database/WithDatabase";
import type { ListingScoreSortSchema } from "../schema/ListingScoreSortSchema";

export namespace withListingScoreSelect {
	export interface Props {
		database: WithDatabase;
		sort: ListingScoreSortSchema.Type[] | undefined;
	}

	export type Select = ReturnType<typeof withListingScoreSelect>;
}

export const withListingScoreSelect = ({ database, sort }: withListingScoreSelect.Props) => {
	let query = database.selectFrom("listing_score as ls").select([
		"ls.id",
		"ls.listingId",
		"ls.score",
		"ls.type",
		"ls.createdAt",
	]);

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("score", () => query.orderBy("ls.score", item.direction))
			.with("createdAt", () => query.orderBy("ls.createdAt", item.direction))
			.exhaustive();
	}

	return query;
};
