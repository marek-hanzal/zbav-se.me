import { withCollection } from "@use-pico/common/collection";
import { EntitySchema } from "@use-pico/common/schema";
import { Effect } from "effect";
import { withFeedCollectionSelect } from "~/app/feed/db/withFeedCollectionSelect";
import { withFeedQueryBuilder } from "~/app/feed/db/withFeedQueryBuilder";
import type { FeedQuerySchema } from "~/app/feed/schema/FeedQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace feedCollectionFx {
	export type Props = FeedQuerySchema.Type;
}

export const feedCollectionFx = (query: feedCollectionFx.Props) => {
	const { cursor, filter, where, sort } = query;
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		return yield* Effect.tryPromise(async () => {
			return withCollection({
				select: withFeedCollectionSelect({
					database,
					sort,
				}),
				output: EntitySchema,
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

export type feedCollectionFx = ReturnType<typeof feedCollectionFx>;
