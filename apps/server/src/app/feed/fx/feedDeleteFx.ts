import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { feedFetchFx } from "~/app/feed/fx/feedFetchFx";
import type { FeedFilterSchema } from "~/app/feed/schema/FeedFilterSchema";
import type { FeedQuerySchema } from "~/app/feed/schema/FeedQuerySchema";
import type { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

export namespace feedDeleteFx {
	export interface Props extends FeedQuerySchema.Type {
		scope: FeedFilterSchema.Type;
	}
}

export const feedDeleteFx = Effect.fn("feedDeleteFx")(function* (query: feedDeleteFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const database = yield* DatabaseContextFx;

			const feed = yield* feedFetchFx(query);

			yield* Effect.promise(async () => {
				return database.deleteFrom("feed").where("id", "=", feed.id).execute();
			});

			return feed;
		}),
	);
});

export type feedDeleteFx = ReturnType<typeof feedDeleteFx>;

type _NoUser = AssertNever<Extract<Effect.Effect.Context<feedDeleteFx>, UserContextFx>>;
