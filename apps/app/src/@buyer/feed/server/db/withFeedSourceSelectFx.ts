import { Effect } from "effect";
import { match } from "ts-pattern";
import type { FeedSortSchema } from "~/@buyer/feed/server/schema/FeedSortSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";

export namespace withFeedSourceSelectFx {
	export interface Props {
		sort?: FeedSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withFeedSourceSelectFx>>;
}

export const withFeedSourceSelectFx = Effect.fn("withFeedSourceSelectFx")(function* ({
	sort,
}: withFeedSourceSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let query = kysely.selectFrom("feed as f");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("f.createdAt", item.order))
			.with("updatedAt", () => query.orderBy("f.updatedAt", item.order))
			.exhaustive();
	}

	return query;
});
