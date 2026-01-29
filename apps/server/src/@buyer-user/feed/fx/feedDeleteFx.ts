import { Effect } from "effect";
import { feedFetchFx } from "~/@buyer-user/feed/fx/feedFetchFx";
import type { FeedFilterSchema } from "~/@buyer-user/feed/schema/FeedFilterSchema";
import type { FeedQuerySchema } from "~/@buyer-user/feed/schema/FeedQuerySchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

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

			yield* Effect.promise(async () => {
				return kysely.deleteFrom("feed").where("id", "=", feed.id).execute();
			});

			return feed;
		}),
	);
});

export type feedDeleteFx = ReturnType<typeof feedDeleteFx>;
