import { match } from "ts-pattern";
import { database } from "../database/kysely";
import type { FeedSortSchema } from "./schema/FeedSortSchema";

export namespace withFeedSelect {
	export interface Props {
		sort?: FeedSortSchema.Type[];
	}

	export type Select = ReturnType<typeof withFeedSelect>;
}

export const withFeedSelect = ({ sort }: withFeedSelect.Props = {}) => {
	let query = database.kysely.selectFrom("feed as f").select([
		"f.id",
		"f.listing",
	]);

	for (const sortItem of sort ?? []) {
		if (!sortItem.sort) {
			continue;
		}
		const { sort: key, value } = sortItem;

		query = match(value)
			.with("createdAt", () => query.orderBy("f.createdAt", key))
			.with("updatedAt", () => query.orderBy("f.updatedAt", key))
			.exhaustive();
	}

	return query;
};
