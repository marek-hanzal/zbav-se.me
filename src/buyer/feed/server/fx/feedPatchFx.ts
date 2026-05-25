import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { getLoggerFx } from "@/lib/common/log";
import { feedFetchFx } from "~/buyer/feed/server/fx/feedFetchFx";
import type { FeedFilterSchema } from "~/buyer/feed/server/schema/FeedFilterSchema";
import type { FeedPatchSchema } from "~/buyer/feed/server/schema/FeedPatchSchema";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";

export namespace feedPatchFx {
	export interface Props extends FeedPatchSchema.Type {
		scope: FeedFilterSchema.Type;
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
			const dateContext = yield* DateContextFx;

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
						updatedAt: dateContext.now().toJSDate(),
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
