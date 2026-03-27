import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withFeedCollectionSelectFx } from "~/buyer/feed/server/db/withFeedCollectionSelectFx";
import { withFeedQueryBuilderFx } from "~/buyer/feed/server/db/withFeedQueryBuilderFx";
import type { FeedCountQuerySchema } from "~/buyer/feed/server/schema/FeedCountQuerySchema";
import type { FeedFilterSchema } from "~/buyer/feed/server/schema/FeedFilterSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";

export namespace feedCountFx {
	export interface Props extends FeedCountQuerySchema.Type {
		scope: FeedFilterSchema.Type;
	}
}

export const feedCountFx = Effect.fn("feedCountFx")(function* ({
	filter,
	where,
	scope,
}: feedCountFx.Props) {
	const hasFilter = !!(filter && Object.keys(filter).length > 0);
	const hasWhere = !!(where && Object.keys(where).length > 0);

	/**
	 * Fast path for empty count payload (e.g. {}): count directly from feed by scope.
	 */
	if (!hasFilter && !hasWhere) {
		const { kysely } = yield* KyselyContextFx;

		let query = kysely.selectFrom("feed as f");
		if (scope?.userId) {
			query = query.where("f.userId", "=", scope.userId);
		}

		const { count } = yield* Effect.promise(async () => {
			return query
				.select((eb) => eb.fn.countAll<number>().as("count"))
				.executeTakeFirstOrThrow();
		});

		const total = Number(count);

		return {
			total,
			filter: total,
			where: total,
			isEmpty: total === 0,
			isFilterEmpty: false,
		};
	}

	return yield* withCountFx({
		selectFx: withFeedCollectionSelectFx({}),
		filter,
		where,
		scope,
		queryFx: withFeedQueryBuilderFx,
	});
});

export type feedCountFx = ReturnType<typeof feedCountFx>;
