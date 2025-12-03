import { withFeedSelect } from "~/@user/feed/db/withFeedSelect";
import type { FeedSortSchema } from "~/@user/feed/schema/FeedSortSchema";
import type { WithDatabase } from "~/database/WithDatabase";

export namespace withListingCartFeedSelect {
	export interface Props {
		database: WithDatabase;
		sort: FeedSortSchema.Type[] | undefined;
		userId: string;
	}

	export type Select = ReturnType<typeof withListingCartFeedSelect>;
}

export const withListingCartFeedSelect = ({
	database,
	sort,
	userId,
}: withListingCartFeedSelect.Props) => {
	return withFeedSelect({
		database,
		sort,
	})
		.select((eb) =>
			eb
				.selectFrom("listing_cart")
				.select((eb) => eb.fn.count<number>("listing_cart.id").$notNull().as("count"))
				.whereRef("listing_cart.feedId", "=", "f.id")
				.where("listing_cart.userId", "=", userId)
				.$asScalar()
				.$notNull()
				.as("count"),
		)
		.where("f.id", "in", (eb) =>
			eb.selectFrom("listing_cart").select("feedId").where("userId", "=", userId),
		);
};
