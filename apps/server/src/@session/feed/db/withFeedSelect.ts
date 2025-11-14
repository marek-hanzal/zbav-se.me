import { match } from "ts-pattern";
import { database } from "../../../database/kysely";
import type { FeedSortSchema } from "../schema/FeedSortSchema";

export namespace withFeedSelect {
	export interface Props {
		sort: FeedSortSchema.Type[] | undefined;
	}

	export type Select = ReturnType<typeof withFeedSelect>;
}

export const withFeedSelect = ({ sort }: withFeedSelect.Props) => {
	let query = database.kysely.selectFrom("feed as f").select([
		"f.id",
		"f.locationId",
		"f.name",
		"f.query",
	]);

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("f.createdAt", item.direction))
			.with("updatedAt", () => query.orderBy("f.updatedAt", item.direction))
			.exhaustive();
	}

	return query;
};
