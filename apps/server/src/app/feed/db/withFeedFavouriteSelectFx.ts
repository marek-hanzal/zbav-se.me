import { Effect } from "effect";
import { withFeedSelectFx } from "~/app/feed/db/withFeedSelectFx";
import type { FeedSortSchema } from "~/app/feed/schema/FeedSortSchema";

export namespace withFeedFavouriteSelectFx {
	export interface Props {
		userId: string;
		sort?: FeedSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withFeedFavouriteSelectFx>>;
}

export const withFeedFavouriteSelectFx = Effect.fn("withFeedFavouriteSelectFx")(function* ({
	userId,
	sort,
}: withFeedFavouriteSelectFx.Props) {
	const feedSelect = yield* withFeedSelectFx({
		sort,
	});

	return feedSelect
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
});
