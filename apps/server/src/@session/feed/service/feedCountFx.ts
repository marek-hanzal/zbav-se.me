import { withCount } from "@use-pico/common/count";
import { Effect } from "effect";
import { withFeedQueryBuilder } from "../db/withFeedQueryBuilder";
import { withFeedSelect } from "../db/withFeedSelect";
import type { FeedQuerySchema } from "../schema/FeedQuerySchema";

export namespace feedCountFx {
	export interface Props {
		userId: string;
		query: Omit<FeedQuerySchema.Type, "cursor" | "sort">;
	}
}

export const feedCountFx = ({ userId, query: { filter, where } }: feedCountFx.Props) => {
	return Effect.gen(function* () {
		return yield* Effect.promise(async () => {
			return withCount({
				select: withFeedSelect({
					sort: [],
				}),
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

export type feedCountFx = ReturnType<typeof feedCountFx>;
