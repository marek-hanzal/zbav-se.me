import { Effect } from "effect";
import { match } from "ts-pattern";
import type { FeedSortSchema } from "~/app/feed/schema/FeedSortSchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace withFeedCollectionSelectFx {
	export interface Props {
		sort?: FeedSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withFeedCollectionSelectFx>>;
}

export const withFeedCollectionSelectFx = Effect.fn("withFeedCollectionSelectFx")(function* ({
	sort,
}: withFeedCollectionSelectFx.Props) {
	const database = yield* DatabaseContextFx;

	let query = database.selectFrom("feed as f").select("f.id");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("f.createdAt", item.direction))
			.with("updatedAt", () => query.orderBy("f.updatedAt", item.direction))
			.exhaustive();
	}

	return query;
});
