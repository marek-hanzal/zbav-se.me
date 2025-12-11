import { match } from "ts-pattern";
import type { FavouriteSortSchema } from "~/@user/favourite/schema/FavouriteSortSchema";
import type { WithDatabase } from "~/database/WithDatabase";

export namespace withFavouriteSelect {
	export interface Props {
		database: WithDatabase;
		sort: FavouriteSortSchema.Type[] | undefined;
	}

	export type Select = ReturnType<typeof withFavouriteSelect>;
}

export const withFavouriteSelect = ({ database, sort }: withFavouriteSelect.Props) => {
	let query = database.selectFrom("favourite as f").select([
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
