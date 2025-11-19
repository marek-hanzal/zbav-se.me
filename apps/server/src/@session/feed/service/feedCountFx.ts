import { withCount } from "@use-pico/common/count";
import { Effect } from "effect";
import { DatabaseContextFx } from "../../../service/DatabaseContextFx";
import { UserContextFx } from "../../../service/UserContextFx";
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

		return yield* Effect.promise(async () => {
			return withCount({
				select: withFeedSelect({
					database,
					sort: [],
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
