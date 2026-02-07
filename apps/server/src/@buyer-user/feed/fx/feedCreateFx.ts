import { DateContextFx } from "@use-pico/common/date";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { feedFetchFx } from "~/@buyer-user/feed/fx/feedFetchFx";
import type { FeedCreateSchema } from "~/@buyer-user/feed/schema/FeedCreateSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
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
	yield* Effect.annotateLogsScoped({
		"feedCreateFx.userId": userId,
		"feedCreateFx.query": query,
		"feedCreateFx.data": data,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;
			const dateContext = yield* DateContextFx;

			const id = genId();
			const now = dateContext.now();

			yield* Effect.promise(async () => {
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
