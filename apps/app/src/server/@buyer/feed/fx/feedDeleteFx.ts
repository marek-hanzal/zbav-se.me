import { Effect } from "effect";
import { feedFetchFx } from "~/server/@buyer/feed/fx/feedFetchFx";
import type { FeedFilterSchema } from "~/server/@buyer/feed/schema/FeedFilterSchema";
import type { FeedQuerySchema } from "~/server/@buyer/feed/schema/FeedQuerySchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";

export namespace feedDeleteFx {
	export interface Props extends FeedQuerySchema.Type {
		scope: FeedFilterSchema.Type;
	}
}

export const feedDeleteFx = Effect.fn("feedDeleteFx")(function* (query: feedDeleteFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;

			const feed = yield* feedFetchFx(query);

			yield* tryDbFx(async () =>
				kysely.deleteFrom("feed").where("id", "=", feed.id).execute(),
			);

			return feed;
		}),
	);
});

export type feedDeleteFx = ReturnType<typeof feedDeleteFx>;
