import { withCount } from "@use-pico/common/count";
import { Effect } from "effect";
import { UserContextFx } from "../../../auth/UserContextFx";
import { DatabaseContextFx } from "../../../database/fx/DatabaseContextFx";
import { withFeedQueryBuilder } from "../db/withFeedQueryBuilder";
import { withFeedSelect } from "../db/withFeedSelect";
import type { FeedQuerySchema } from "../schema/FeedQuerySchema";

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
