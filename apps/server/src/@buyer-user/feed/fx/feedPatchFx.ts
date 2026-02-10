import { DateContextFx } from "@use-pico/common/date";
import { Effect } from "effect";
import { feedFetchFx } from "~/@buyer-user/feed/fx/feedFetchFx";
import type { FeedFilterSchema } from "~/@buyer-user/feed/schema/FeedFilterSchema";
import type { FeedPatchSchema } from "~/@buyer-user/feed/schema/FeedPatchSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { withTraceFx } from "~/effect/withTraceFx";

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
	yield* withTraceFx({
		fx: "feedPatchFx",
		input: {
			patch,
			query,
			scope,
		},
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;
			const dateContext = yield* DateContextFx;

			const feed = yield* feedFetchFx({
				...query,
				scope,
			});

			yield* tryDbFx(async () =>
				kysely
					.updateTable("feed")
					.set({
						...patch,
						query: patch.query ? (JSON.stringify(patch.query) as any) : patch.query,
						updatedAt: dateContext.now().toJSDate(),
					})
					.where("id", "=", feed.id)
					.executeTakeFirst(),
			);

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
