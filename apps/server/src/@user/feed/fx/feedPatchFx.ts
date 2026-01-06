import { Effect } from "effect";
import { feedFetchFx } from "~/@user/feed/fx/feedFetchFx";
import type { FeedPatchSchema } from "~/@user/feed/schema/FeedPatchSchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

export namespace feedPatchFx {
	export type Props = FeedPatchSchema.Type;
}

export const feedPatchFx = Effect.fn("feedPatchFx")(function* ({
	patch,
	query,
}: feedPatchFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const database = yield* DatabaseContextFx;

			const feed = yield* feedFetchFx(query);

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
			});
		}),
	);
});

export type feedPatchFx = ReturnType<typeof feedPatchFx>;
