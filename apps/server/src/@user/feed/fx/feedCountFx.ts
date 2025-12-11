import { withCount } from "@use-pico/common/count";
import { Effect } from "effect";
import { withFeedQueryBuilder } from "~/app/feed/db/withFeedQueryBuilder";
import { withFeedSelect } from "~/app/feed/db/withFeedSelect";
import type { FeedQuerySchema } from "~/app/feed/schema/FeedQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace feedCountFx {
	export interface Props {
		query: Omit<FeedQuerySchema.Type, "cursor" | "sort">;
	}
}

export const feedCountFx = ({ query: { filter, where } }: feedCountFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		return yield* Effect.tryPromise(async () => {
			return withCount({
				select: withFeedSelect({
					database,
					sort: undefined,
				}),
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

export type feedCountFx = ReturnType<typeof feedCountFx>;
