import { Effect } from "effect";
import { feedFetchFx } from "~/buyer-feed/fx/feedFetchFx";
import type { FeedQuerySchema } from "~/buyer-feed/schema/FeedQuerySchema";
import type { FeedWhereSchema } from "~/buyer-feed/schema/FeedWhereSchema";
import { dbFx } from "~/database/fx/dbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";

export namespace feedDeleteFx {
	export interface Props extends FeedQuerySchema.Type {
		scope: FeedWhereSchema.Type;
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
