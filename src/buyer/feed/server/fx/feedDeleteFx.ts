import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { feedFetchFx } from "~/buyer/feed/server/fx/feedFetchFx";
import type { FeedFilterSchema } from "~/buyer/feed/server/schema/FeedFilterSchema";
import type { FeedQuerySchema } from "~/buyer/feed/server/schema/FeedQuerySchema";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";

export namespace feedDeleteFx {
	export interface Props extends FeedQuerySchema.Type {
		scope: FeedFilterSchema.Type;
	}
}

export const feedDeleteFx = Effect.fn("feedDeleteFx")(function* (query: feedDeleteFx.Props) {
	const logger = yield* getLoggerFx("feedDeleteFx");
	logger.trace("feedDeleteFx", {
		...query,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const feed = yield* feedFetchFx(query);

			yield* dbFx(async (kysely) => {
				return kysely.deleteFrom("feed").where("id", "=", feed.id).execute();
			});

			return feed;
		}),
	);
});

export type feedDeleteFx = ReturnType<typeof feedDeleteFx>;
