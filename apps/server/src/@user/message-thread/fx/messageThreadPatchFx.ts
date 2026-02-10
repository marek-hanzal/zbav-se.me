import { DateContextFx } from "@use-pico/common/date";
import { Effect } from "effect";
import { messageThreadFetchFx } from "~/@user/message-thread/fx/messageThreadFetchFx";
import type { MessageThreadFilterSchema } from "~/@user/message-thread/schema/MessageThreadFilterSchema";
import type { MessageThreadPatchSchema } from "~/@user/message-thread/schema/MessageThreadPatchSchema";
import { messageUserCheckFx } from "~/@user/message-thread-user/fx/messageUserCheckFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { withTraceFx } from "~/effect/withTraceFx";

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
	yield* withTraceFx({
		fx: "messageThreadPatchFx",
		input: {
			userId,
			patch,
			query,
			scope,
		},
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;
			const dateContext = yield* DateContextFx;

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

			yield* tryDbFx(async () =>
				kysely
					.updateTable("message_thread")
					.set({
						...patch,
						updatedAt: dateContext.now().toJSDate(),
					})
					.where("id", "=", messageThread.id)
					.executeTakeFirst(),
			);

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
