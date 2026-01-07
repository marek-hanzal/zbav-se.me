import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import type { FeedPatchSchema } from "~/@user/feed/schema/FeedPatchSchema";
import { feedFetchFx } from "~/app/feed/fx/feedFetchFx";
import type { FeedFilterSchema } from "~/app/feed/schema/FeedFilterSchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

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
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const database = yield* DatabaseContextFx;

			const feed = yield* feedFetchFx({
				...query,
				scope,
			});

			yield* Effect.promise(async () => {
				return database
					.updateTable("feed")
					.set({
						...patch,
						query: patch.query ? (JSON.stringify(patch.query) as any) : patch.query,
						updatedAt: new Date(),
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

