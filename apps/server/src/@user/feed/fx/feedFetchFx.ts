import { withFetch } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withFeedQueryBuilder } from "~/app/feed/db/withFeedQueryBuilder";
import { withFeedSelect } from "~/app/feed/db/withFeedSelect";
import type { FeedQuerySchema } from "~/app/feed/schema/FeedQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { NotFoundError } from "~/error/NotFoundError";
import { FeedSchema } from "../schema/FeedSchema";

export namespace feedFetchFx {
	export type Props = FeedQuerySchema.Type;
}

export const feedFetchFx = (query: feedFetchFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		const data = yield* Effect.tryPromise(async () => {
			const { filter, where, sort } = query;

			return withFetch({
				select: withFeedSelect({
					database,
					sort,
				}),
				output: FeedSchema,
				filter,
				where: {
					...where,
					userId: user.id,
				},
				query: withFeedQueryBuilder,
			});
		});

		if (!data) {
			return yield* new NotFoundError({
				resource: "feed",
				resourceId: "(query)",
				message: "Feed item not found",
			});
		}

		return data;
	});
};

export type feedFetchFx = ReturnType<typeof feedFetchFx>;
