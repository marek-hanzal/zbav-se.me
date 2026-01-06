import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { messageThreadFetchFx } from "~/app/message-thread/fx/messageThreadFetchFx";
import type { MessageThreadFilterSchema } from "~/app/message-thread/schema/MessageThreadFilterSchema";
import type { MessageThreadPatchSchema } from "~/app/message-thread/schema/MessageThreadPatchSchema";
import { messageUserCheckFx } from "~/app/message-thread-user/fx/messageUserCheckFx";
import type { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
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
			const database = yield* DatabaseContextFx;

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
				return database
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

type _NoUser = AssertNever<Extract<Effect.Effect.Context<messageThreadPatchFx>, UserContextFx>>;
