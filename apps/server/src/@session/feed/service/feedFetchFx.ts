import { withFetch } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { NotFoundError } from "../../../error/NotFoundError";
import { withFeedQueryBuilder } from "../db/withFeedQueryBuilder";
import { withFeedSelect } from "../db/withFeedSelect";
import type { FeedQuerySchema } from "../schema/FeedQuerySchema";
import { FeedSchema } from "../schema/FeedSchema";

export namespace feedFetchFx {
	export interface Props {
		userId: string;
		query: Omit<FeedQuerySchema.Type, "cursor">;
	}
}

export const feedFetchFx = ({ userId, query }: feedFetchFx.Props) => {
	return Effect.gen(function* () {
		const data = yield* Effect.promise(async () => {
			const { filter, where, sort } = query;

			return withFetch({
				select: withFeedSelect({
					sort,
				}),
				output: FeedSchema,
				filter,
				where: {
					...where,
					userId,
				},
				query: withFeedQueryBuilder,
			});
		});

		if (!data) {
			return yield* Effect.fail(
				new NotFoundError({
					resource: "feed",
					resourceId: "(query)",
					message: "Feed item not found",
				}),
			);
		}

		return data;
	});
};

export type feedFetchFx = ReturnType<typeof feedFetchFx>;
