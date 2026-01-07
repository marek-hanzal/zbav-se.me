import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { messageTextFetchFx } from "~/app/message-text/fx/messageTextFetchFx";
import type { MessageTextCreateSchema } from "~/app/message-text/schema/MessageTextCreateSchema";
import { messageUserCheckFx } from "~/app/message-thread-user/fx/messageUserCheckFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
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
			const kysely = yield* KyselyContextFx;

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
