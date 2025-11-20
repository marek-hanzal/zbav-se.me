import { withFetch } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { UserContextFx } from "../../../auth/fx/UserContextFx";
import { DatabaseContextFx } from "../../../database/fx/DatabaseContextFx";
import { NotFoundError } from "../../../error/NotFoundError";
import { withFeedQueryBuilder } from "../db/withFeedQueryBuilder";
import { withFeedSelect } from "../db/withFeedSelect";
import type { FeedQuerySchema } from "../schema/FeedQuerySchema";
import { FeedSchema } from "../schema/FeedSchema";

export namespace feedFetchFx {
	export interface Props {
		query: Omit<FeedQuerySchema.Type, "cursor">;
	}
}

export const feedFetchFx = ({ query }: feedFetchFx.Props) => {
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
