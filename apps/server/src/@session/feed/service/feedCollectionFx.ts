import { withCollection } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withFeedQueryBuilder } from "../db/withFeedQueryBuilder";
import { withFeedSelect } from "../db/withFeedSelect";
import type { FeedQuerySchema } from "../schema/FeedQuerySchema";
import { FeedSchema } from "../schema/FeedSchema";

export namespace feedCollectionFx {
	export interface Props {
		userId: string;
		query: FeedQuerySchema.Type;
	}
}

export const feedCollectionFx = ({
	userId,
	query: { cursor, filter, where, sort },
}: feedCollectionFx.Props) => {
	return Effect.gen(function* () {
		return yield* Effect.promise(async () => {
			return withCollection({
				select: withFeedSelect({
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
					userId,
				},
				query: withFeedQueryBuilder,
			});
		});
	});
};

export type feedCollectionFx = ReturnType<typeof feedCollectionFx>;
