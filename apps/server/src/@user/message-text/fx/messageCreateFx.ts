import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { messageTextFetchFx } from "~/@user/message-text/fx/messageFetchFx";
import { messageUserCheckFx } from "~/@user/message-thread-user/fx/messageUserCheckFx";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

export namespace messageTextCreateFx {
	export interface Props {
		messageThreadId: string;
		message: string;
	}
}

export const messageTextCreateFx = Effect.fn("messageTextCreateFx")(function* ({
	messageThreadId,
	message,
}: messageTextCreateFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const database = yield* DatabaseContextFx;
			const user = yield* UserContextFx;

			yield* messageUserCheckFx({
				userIds: [
					user.id,
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
						userId: user.id,
						text: message,
						createdAt: new Date(),
					})
					.returningAll()
					.executeTakeFirstOrThrow();
			});

			return yield* messageTextFetchFx({
				where: {
					id,
				},
			});
		}),
	);
});

export type messageTextCreateFx = ReturnType<typeof messageTextCreateFx>;
