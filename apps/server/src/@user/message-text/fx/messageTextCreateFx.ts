import { DateContextFx } from "@use-pico/common/date";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import type { MessageTextCreateSchema } from "~/@user/message-text/schema/MessageTextCreateSchema";
import { messageUserCheckFx } from "~/app/message-thread-user/fx/messageUserCheckFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { messageTextFetchFx } from "./messageTextFetchFx";

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
					.insertInto("message_text")
					.values({
						id,
						messageThreadId,
						userId,
						text: message,
						createdAt: dateContext.now().toJSDate(),
					})
					.returningAll()
					.executeTakeFirstOrThrow();
			});

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
