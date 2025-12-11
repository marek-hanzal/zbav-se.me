import { jsonObjectFrom } from "kysely/helpers/postgres";
import { match } from "ts-pattern";
import type { FeedSortSchema } from "~/app/feed/schema/FeedSortSchema";
import type { WithDatabase } from "~/database/WithDatabase";

export namespace withFeedSelect {
	export interface Props {
		database: WithDatabase;
		sort: FeedSortSchema.Type[] | undefined;
	}

	export type Select = ReturnType<typeof withFeedSelect>;
}

export const withFeedSelect = ({ database, sort }: withFeedSelect.Props) => {
	let query = database
		.selectFrom("feed as f")
		.selectAll()
		.select((eb) =>
			jsonObjectFrom(
				eb
					.selectFrom("upload as u")
					.selectAll()
					.whereRef("u.id", "=", "f.uploadId")
					.limit(1),
			).as("upload"),
		);

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("f.createdAt", item.direction))
			.with("updatedAt", () => query.orderBy("f.updatedAt", item.direction))
			.exhaustive();
	}

	return query;
};
