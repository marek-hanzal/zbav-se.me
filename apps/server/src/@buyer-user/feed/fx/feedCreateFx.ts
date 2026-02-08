import { DateContextFx } from "@use-pico/common/date";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { DatabaseError } from "pg";
import { feedFetchFx } from "~/@buyer-user/feed/fx/feedFetchFx";
import type { FeedCreateSchema } from "~/@buyer-user/feed/schema/FeedCreateSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { withTraceFx } from "~/effect/withTraceFx";
import { RuntimeErrorFx } from "~/error/RuntimeErrorFx";

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
	yield* withTraceFx({
		fx: "feedCreateFx",
		input: {
			userId,
			query,
			...data,
		},
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;
			const dateContext = yield* DateContextFx;

			const id = genId();
			const now = dateContext.now();

			yield* Effect.tryPromise({
				async try() {
					return kysely
						.insertInto("feed")
						.values({
							...data,
							id,
							userId,
							uploadId: null,
							query: JSON.stringify(query) as any,
							createdAt: now.toJSDate(),
							updatedAt: now.toJSDate(),
						})
						.returningAll()
						.executeTakeFirstOrThrow();
				},
				catch(error) {
					if (error instanceof DatabaseError) {
						return new RuntimeErrorFx({
							message: error.message,
						});
					}

					return new RuntimeErrorFx({
						message: error instanceof Error ? error.message : String(error),
					});
				},
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
