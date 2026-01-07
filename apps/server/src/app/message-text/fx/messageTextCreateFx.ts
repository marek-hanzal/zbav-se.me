import { genId } from "@use-pico/common/gen-id";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { messageTextFetchFx } from "~/app/message-text/fx/messageTextFetchFx";
import type { MessageTextCreateSchema } from "~/app/message-text/schema/MessageTextCreateSchema";
import { messageUserCheckFx } from "~/app/message-thread-user/fx/messageUserCheckFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

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
			const database = yield* DatabaseContextFx;

			yield* messageUserCheckFx({
				userIds: [
					userId,
				],
				messageThreadId,
			});

			const id = genId();

			yield* Effect.promise(async () => {
				return database
					.insertInto("message_text")
					.values({
						id,
						messageThreadId,
						userId,
						text: message,
						createdAt: new Date(),
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

