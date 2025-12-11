import { withFeedSelect } from "~/app/feed/db/withFeedSelect";
import type { FeedSortSchema } from "~/@user/feed/schema/FeedSortSchema";
import type { WithDatabase } from "~/database/WithDatabase";

export namespace withFavouriteFeedSelect {
	export interface Props {
		database: WithDatabase;
		sort: FeedSortSchema.Type[] | undefined;
		userId: string;
	}

	export type Select = ReturnType<typeof withFavouriteFeedSelect>;
}

export const withFavouriteFeedSelect = ({
	database,
	sort,
	userId,
}: withFavouriteFeedSelect.Props) => {
	return withFeedSelect({
		database,
		sort,
	})
		.select((eb) =>
			eb
				.selectFrom("favourite")
				.select((eb) => eb.fn.count<number>("favourite.id").$notNull().as("count"))
				.whereRef("favourite.feedId", "=", "f.id")
				.where("favourite.userId", "=", userId)
				.$asScalar()
				.$notNull()
				.as("count"),
		)
		.where("f.id", "in", (eb) =>
			eb.selectFrom("favourite").select("feedId").where("userId", "=", userId),
		);
};
