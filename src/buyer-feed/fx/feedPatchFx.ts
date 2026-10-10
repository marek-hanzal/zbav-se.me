import { Effect } from "effect";
import { feedFetchFx } from "~/buyer-feed/fx/feedFetchFx";
import type { FeedPatchSchema } from "~/buyer-feed/schema/FeedPatchSchema";
import type { FeedWhereSchema } from "~/buyer-feed/schema/FeedWhereSchema";
import { dbFx } from "~/database/fx/dbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { DateServiceFx } from "~/date/service/DateServiceFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";

export namespace feedPatchFx {
	export interface Props extends FeedPatchSchema.Type {
		scope: FeedWhereSchema.Type;
	}
}

export const feedPatchFx = Effect.fn("feedPatchFx")(function* ({
	patch,
	query,
	scope,
}: feedPatchFx.Props) {
	const logger = yield* getLoggerFx("feedPatchFx");
	logger.trace("feedPatchFx", {
		patch,
		query,
		scope,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const dateContext = yield* DateServiceFx;

			const feed = yield* feedFetchFx({
				...query,
				scope,
			});

			yield* dbFx(async (kysely) => {
				return kysely
					.updateTable("feed")
					.set({
						...patch,
						query: patch.query ? (JSON.stringify(patch.query) as any) : patch.query,
						updatedAt: dateContext.nowFn().toJSDate(),
					})
					.where("id", "=", feed.id)
					.executeTakeFirst();
			});

			return yield* feedFetchFx({
				where: {
					id: feed.id,
				},
				scope: {},
			});
		}),
	);
});

export type feedPatchFx = ReturnType<typeof feedPatchFx>;
