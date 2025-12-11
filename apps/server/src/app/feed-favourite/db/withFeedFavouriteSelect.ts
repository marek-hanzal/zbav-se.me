import type { FeedSortSchema } from "~/@user/feed/schema/FeedSortSchema";
import { withFeedSelect } from "~/app/feed/db/withFeedSelect";
import type { WithDatabase } from "~/database/WithDatabase";

export namespace withFeedFavouriteSelect {
	export interface Props {
		database: WithDatabase;
		sort: FeedSortSchema.Type[] | undefined;
		userId: string;
	}

	export type Select = ReturnType<typeof withFeedFavouriteSelect>;
}

export const withFeedFavouriteSelect = ({
	database,
	sort,
	userId,
}: withFeedFavouriteSelect.Props) => {
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
