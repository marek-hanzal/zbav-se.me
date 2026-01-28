import { DateContextFx } from "@use-pico/common/date";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import type { MessageThreadCreateSchema } from "~/@user/message-thread/schema/MessageThreadCreateSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { messageThreadFetchFx } from "~/@user/message-thread/fx/messageThreadFetchFx";

export namespace messageThreadCreateFx {
	export type Props = MessageThreadCreateSchema.Type;
}

export const messageThreadCreateFx = Effect.fn("messageThreadCreateFx")(function* (
	_: messageThreadCreateFx.Props,
) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;
			const dateContext = yield* DateContextFx;

			const id = genId();
			const now = dateContext.now();

			yield* Effect.promise(async () => {
				return kysely
					.insertInto("message_thread")
					.values({
						id,
						createdAt: now.toJSDate(),
						updatedAt: now.toJSDate(),
					})
					.returningAll()
					.executeTakeFirstOrThrow();
			});

			return yield* messageThreadFetchFx({
				where: {
					id,
				},
				scope: {},
			});
		}),
	);
});

export type messageThreadCreateFx = ReturnType<typeof messageThreadCreateFx>;
