import { DateContextFx } from "@use-pico/common/date";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { messagePersonalFetchFx } from "~/@user/message-personal/fx/messagePersonalFetchFx";
import type { MessagePersonalCreateSchema } from "~/@user/message-personal/schema/MessagePersonalCreateSchema";
import { messageUserCheckFx } from "~/@user/message-thread-user/fx/messageUserCheckFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

export namespace messagePersonalCreateFx {
	export interface Props extends MessagePersonalCreateSchema.Type {
		userId: string;
	}
}

export const messagePersonalCreateFx = Effect.fn("messagePersonalCreateFx")(function* ({
	userId,
	messageThreadId,
	...data
}: messagePersonalCreateFx.Props) {
	yield* Effect.annotateLogsScoped({
		"messagePersonalCreateFx.userId": userId,
		"messagePersonalCreateFx.messageThreadId": messageThreadId,
		"messagePersonalCreateFx.data": "(redacted)",
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;
			const dateContext = yield* DateContextFx;

			yield* messageUserCheckFx({
				userIds: [
					userId,
				],
				messageThreadId,
			});

			const id = genId();

			yield* Effect.promise(async () => {
				return kysely
					.insertInto("message_personal")
					.values({
						...data,
						id,
						messageThreadId,
						userId,
						createdAt: dateContext.now().toJSDate(),
					})
					.returningAll()
					.executeTakeFirstOrThrow();
			});

			return yield* messagePersonalFetchFx({
				where: {
					id,
				},
				userId,
				scope: {
					userId,
				},
			});
		}),
	);
});

export type messagePersonalCreateFx = ReturnType<typeof messagePersonalCreateFx>;
