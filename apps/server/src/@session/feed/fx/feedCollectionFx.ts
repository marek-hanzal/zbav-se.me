import { withCollection } from "@use-pico/common/collection";
import { Effect } from "effect";
import { DatabaseContextFx } from "../../../database/fx/DatabaseContextFx";
import { UserContextFx } from "../../../fx/UserContextFx";
import { withFeedQueryBuilder } from "../db/withFeedQueryBuilder";
import { withFeedSelect } from "../db/withFeedSelect";
import type { FeedQuerySchema } from "../schema/FeedQuerySchema";
import { FeedSchema } from "../schema/FeedSchema";

export namespace feedCollectionFx {
	export interface Props {
		query: FeedQuerySchema.Type;
	}
}

export const feedCollectionFx = ({
	query: { cursor, filter, where, sort },
}: feedCollectionFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		return yield* Effect.tryPromise(async () => {
			return withCollection({
				select: withFeedSelect({
					database,
					sort,
				}),
				output: FeedSchema,
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
