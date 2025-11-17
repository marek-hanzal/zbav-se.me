import { withFetch } from "@use-pico/common/fetch";
import { Effect } from "effect";
import type { WithDatabase } from "../../../database/WithDatabase";
import { NotFoundError } from "../../../error/NotFoundError";
import { withFeedQueryBuilder } from "../db/withFeedQueryBuilder";
import { withFeedSelect } from "../db/withFeedSelect";
import type { FeedQuerySchema } from "../schema/FeedQuerySchema";
import { FeedSchema } from "../schema/FeedSchema";

export namespace feedDeleteFx {
	export interface Props {
		database: WithDatabase;
		userId: string;
		query: Omit<FeedQuerySchema.Type, "cursor" | "sort">;
	}
}

export const feedDeleteFx = ({ database, userId, query }: feedDeleteFx.Props) => {
	return Effect.gen(function* () {
		const feed = yield* Effect.promise(async () => {
			return database.transaction().execute(async (trx) => {
				const feed = await withFetch({
					select: withFeedSelect({
						sort: [],
					}),
					output: FeedSchema,
					filter: query.filter,
					where: {
						...query.where,
						userId,
					},
					query: withFeedQueryBuilder,
				});

				if (!feed) {
					return null;
				}

				await trx
					.deleteFrom("feed")
					.where("id", "=", feed.id)
					.where("userId", "=", userId)
					.execute();

				return feed;
			});
		});

		if (!feed) {
			return yield* Effect.fail(
				new NotFoundError({
					resource: "feed",
					resourceId: "(query)",
					message: "Feed item not found",
				}),
			);
		}

		return feed;
	});
};

export type feedDeleteFx = ReturnType<typeof feedDeleteFx>;
