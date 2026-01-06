import { genId } from "@use-pico/common/gen-id";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import type { FeedCreateSchema } from "~/@user/feed/schema/FeedCreateSchema";
import { feedFetchFx } from "~/app/feed/fx/feedFetchFx";
import type { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

export namespace feedCreateFx {
	export interface Props extends FeedCreateSchema.Type {
		userId: string;
	}
}

export const feedCreateFx = Effect.fn("feedCreateFx")(function* ({
	userId,
	query,
	...data
}: feedCreateFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const database = yield* DatabaseContextFx;

			const id = genId();

			yield* Effect.promise(async () => {
				const now = new Date();

				return database
					.insertInto("feed")
					.values({
						...data,
						id,
						userId,
						uploadId: null,
						query: JSON.stringify(query) as any,
						createdAt: now,
						updatedAt: now,
					})
					.returningAll()
					.executeTakeFirstOrThrow();
			});

			return yield* feedFetchFx({
				where: {
					id,
				},
				scope: {
					userId,
				},
			});
		}),
	);
});

export type feedCreateFx = ReturnType<typeof feedCreateFx>;

type _NoUser = AssertNever<Extract<Effect.Effect.Context<feedCreateFx>, UserContextFx>>;
