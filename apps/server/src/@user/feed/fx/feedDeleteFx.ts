import { Effect } from "effect";
import type { FeedFilterSchema } from "~/@user/feed/schema/FeedFilterSchema";
import type { FeedQuerySchema } from "~/@user/feed/schema/FeedQuerySchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { feedFetchFx } from "./feedFetchFx";

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
