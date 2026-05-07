import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { feedFetchFx } from "~/buyer/feed/server/fx/feedFetchFx";
import type { FeedCreateSchema } from "~/buyer/feed/server/schema/FeedCreateSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { ConflictErrorFx } from "~/server/error/ConflictErrorFx";

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
	const logger = yield* getLoggerFx("feedCreateFx");
	logger.trace("feedCreateFx", {
		userId,
		query,
		...data,
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
