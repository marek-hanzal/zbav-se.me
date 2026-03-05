import { DateContextFx } from "@use-pico/common/date";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { feedFetchFx } from "~/@buyer/feed/fx/feedFetchFx";
import type { FeedCreateSchema } from "~/@buyer/feed/schema/FeedCreateSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { traceLogFx } from "~/effect/traceLogFx";
import { ConflictErrorFx } from "~/error/ConflictErrorFx";

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
	yield* traceLogFx({
		level: "trace",
		message: "feedCreateFx",
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

			yield* tryDbFx(
				async () =>
					kysely
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
						.executeTakeFirstOrThrow(),
				{
					"23505": (e) =>
						new ConflictErrorFx({
							message: "Feed already exists",
							cause: e,
						}),
				},
			);

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
