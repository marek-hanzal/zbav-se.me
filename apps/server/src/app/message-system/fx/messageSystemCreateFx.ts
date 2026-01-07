import { genId } from "@use-pico/common/gen-id";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { messageSystemFetchFx } from "~/app/message-system/fx/messageSystemFetchFx";
import { messageUserCheckFx } from "~/app/message-thread-user/fx/messageUserCheckFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

export namespace messageSystemCreateFx {
	export interface Props {
		userId: string;
		messageThreadId: string;
		message: string;
		createdAt?: DateTime;
	}
}

export const messageSystemCreateFx = Effect.fn("messageSystemCreateFx")(function* ({
	userId,
	messageThreadId,
	message,
	createdAt,
}: messageSystemCreateFx.Props) {
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
					.insertInto("message_system")
					.values({
						id,
						messageThreadId,
						text: message,
						createdAt: (createdAt ?? DateTime.now()).toJSDate(),
					})
					.returningAll()
					.executeTakeFirstOrThrow();
			});

			return yield* messageSystemFetchFx({
				where: {
					id,
				},
				scope: {},
			});
		}),
	);
});

export type messageSystemCreateFx = ReturnType<typeof messageSystemCreateFx>;

