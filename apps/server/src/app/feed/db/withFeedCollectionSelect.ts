import { match } from "ts-pattern";
import type { FeedSortSchema } from "~/app/feed/schema/FeedSortSchema";
import type { WithDatabase } from "~/database/WithDatabase";

export namespace withFeedCollectionSelect {
	export interface Props {
		database: WithDatabase;
		sort: FeedSortSchema.Type[] | undefined;
	}

	export type Select = ReturnType<typeof withFeedCollectionSelect>;
}

export const withFeedCollectionSelect = ({ database, sort }: withFeedCollectionSelect.Props) => {
	let query = database.selectFrom("feed as f").select("f.id");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("f.createdAt", item.direction))
			.with("updatedAt", () => query.orderBy("f.updatedAt", item.direction))
			.exhaustive();
	}

	return query;
};
