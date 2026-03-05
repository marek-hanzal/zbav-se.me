import { DateContextFx } from "@use-pico/common/date";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { messageTextFetchFx } from "~/@user/message-text/fx/messageTextFetchFx";
import type { MessageTextCreateSchema } from "~/@user/message-text/schema/MessageTextCreateSchema";
import { messageUserCheckFx } from "~/@user/message-thread-user/fx/messageUserCheckFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { traceLogFx } from "~/effect/traceLogFx";

export namespace messageTextCreateFx {
	export interface Props extends MessageTextCreateSchema.Type {
		userId: string;
	}
}

export const messageTextCreateFx = Effect.fn("messageTextCreateFx")(function* ({
	userId,
	messageThreadId,
	message,
}: messageTextCreateFx.Props) {
	yield* traceLogFx({
		level: "trace",
		message: "messageTextCreateFx",
		input: {
			userId,
			messageThreadId,
			message: "(redacted)",
		},
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

			yield* tryDbFx(async () =>
				kysely
					.insertInto("message_text")
					.values({
						id,
						messageThreadId,
						userId,
						text: message,
						createdAt: dateContext.now().toJSDate(),
					})
					.returningAll()
					.executeTakeFirstOrThrow(),
			);

			return yield* messageTextFetchFx({
				userId,
				where: {
					id,
				},
				scope: {},
			});
		}),
	);
});

export type messageTextCreateFx = ReturnType<typeof messageTextCreateFx>;
