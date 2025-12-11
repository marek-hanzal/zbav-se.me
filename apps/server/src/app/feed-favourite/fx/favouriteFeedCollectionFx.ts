import { withCollection } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withFeedQueryBuilder } from "~/app/feed/db/withFeedQueryBuilder";
import type { FeedQuerySchema } from "~/app/feed/schema/FeedQuerySchema";
import { withFeedFavouriteSelect } from "~/app/feed-favourite/db/withFeedFavouriteSelect";
import { FeedFavouriteSchema } from "~/app/feed-favourite/schema/FeedFavouriteSchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace feedFavouriteCollectionFx {
	export interface Props {
		query: FeedQuerySchema.Type;
	}
}

export const feedFavouriteCollectionFx = ({
	query: { cursor, filter, where, sort },
}: feedFavouriteCollectionFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		return yield* Effect.tryPromise(async () => {
			return withCollection({
				select: withFeedFavouriteSelect({
					database,
					sort,
					userId: user.id,
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
	});
};

export type feedFavouriteCollectionFx = ReturnType<typeof feedFavouriteCollectionFx>;
