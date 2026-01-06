import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { FeedFavouriteSchema } from "~/@user/feed-favourite/schema/FeedFavouriteSchema";
import { withFeedQueryBuilder } from "~/app/feed/db/withFeedQueryBuilder";
import type { FeedQuerySchema } from "~/app/feed/schema/FeedQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { withFeedFavouriteSelectFx } from "../db/withFeedFavouriteSelectFx";

export namespace feedFavouriteCollectionFx {
	export type Props = FeedQuerySchema.Type;
}

export const feedFavouriteCollectionFx = Effect.fn("feedFavouriteCollectionFx")(function* ({
	cursor,
	filter,
	where,
	sort,
}: feedFavouriteCollectionFx.Props) {
	const user = yield* UserContextFx;

	return yield* withCollectionFx({
		select: yield* withFeedFavouriteSelectFx({
			sort,
		}),
		output: FeedFavouriteSchema,
		cursor: cursor ?? {
			page: 0,
			size: 10,
		},
		filter,
		where: {
			...where,
			userId: user.id,
		},
		query: withFeedQueryBuilder,
	});
});

export type feedFavouriteCollectionFx = ReturnType<typeof feedFavouriteCollectionFx>;
