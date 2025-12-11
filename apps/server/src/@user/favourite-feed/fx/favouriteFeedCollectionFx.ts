import { withCollection } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withFavouriteFeedSelect } from "~/app/favourite-feed/db/withFavouriteFeedSelect";
import { FavouriteFeedSchema } from "~/@user/favourite-feed/schema/FavouriteFeedSchema";
import { withFeedQueryBuilder } from "~/app/feed/db/withFeedQueryBuilder";
import type { FeedQuerySchema } from "~/@user/feed/schema/FeedQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace favouriteFeedCollectionFx {
	export interface Props {
		query: FeedQuerySchema.Type;
	}
}

export const favouriteFeedCollectionFx = ({
	query: { cursor, filter, where, sort },
}: favouriteFeedCollectionFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		return yield* Effect.tryPromise(async () => {
			return withCollection({
				select: withFavouriteFeedSelect({
					database,
					sort,
					userId: user.id,
				}),
				output: FavouriteFeedSchema,
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

export type favouriteFeedCollectionFx = ReturnType<typeof favouriteFeedCollectionFx>;
