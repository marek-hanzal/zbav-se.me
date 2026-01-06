import { Effect } from "effect";
import { withFeedSelectFx } from "~/app/feed/db/withFeedSelectFx";
import type { FeedSortSchema } from "~/app/feed/schema/FeedSortSchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";

export namespace withFeedFavouriteSelectFx {
	export interface Props {
		sort?: FeedSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withFeedFavouriteSelectFx>>;
}

export const withFeedFavouriteSelectFx = Effect.fn("withFeedFavouriteSelectFx")(function* ({
	sort,
}: withFeedFavouriteSelectFx.Props) {
	const user = yield* UserContextFx;

	const feedSelect = yield* withFeedSelectFx({
		sort,
	});

	return feedSelect
		.select((eb) =>
			eb
				.selectFrom("favourite")
				.select((eb) => eb.fn.count<number>("favourite.id").$notNull().as("count"))
				.whereRef("favourite.feedId", "=", "f.id")
				.where("favourite.userId", "=", user.id)
				.$asScalar()
				.$notNull()
				.as("count"),
		)
		.where("f.id", "in", (eb) =>
			eb.selectFrom("favourite").select("feedId").where("userId", "=", user.id),
		);
});
