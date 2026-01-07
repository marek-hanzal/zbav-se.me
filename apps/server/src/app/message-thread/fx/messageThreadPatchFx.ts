import { Effect } from "effect";
import { messageThreadFetchFx } from "~/app/message-thread/fx/messageThreadFetchFx";
import type { MessageThreadFilterSchema } from "~/app/message-thread/schema/MessageThreadFilterSchema";
import type { MessageThreadPatchSchema } from "~/app/message-thread/schema/MessageThreadPatchSchema";
import { messageUserCheckFx } from "~/app/message-thread-user/fx/messageUserCheckFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

export namespace messageThreadPatchFx {
	export interface Props extends MessageThreadPatchSchema.Type {
		userId: string;
		scope: MessageThreadFilterSchema.Type;
	}
}

export const messageThreadPatchFx = Effect.fn("messageThreadPatchFx")(function* ({
	userId,
	patch,
	query,
	scope,
}: messageThreadPatchFx.Props) {
	return withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;

			const messageThread = yield* messageThreadFetchFx({
				...query,
				scope,
			});

			yield* messageUserCheckFx({
				userIds: [
					userId,
				],
				messageThreadId: messageThread.id,
			});

			yield* Effect.promise(async () => {
				return kysely
					.updateTable("message_thread")
					.set({
						...patch,
						updatedAt: new Date(),
					})
					.where("id", "=", messageThread.id)
					.executeTakeFirst();
			});

			return yield* messageThreadFetchFx({
				where: {
					id: messageThread.id,
				},
				scope: {},
			});
		}),
	);
});

export type messageThreadPatchFx = ReturnType<typeof messageThreadPatchFx>;
