import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { messageSystemFetchFx } from "~/@user/message-system/fx/messageSystemFetchFx";
import { messageUserCheckFx } from "~/@user/message-thread-user/fx/messageUserCheckFx";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

export namespace messageSystemCreateFx {
	export interface Props {
		messageThreadId: string;
		message: string;
		createdAt?: DateTime;
	}
}

export const messageSystemCreateFx = ({
	messageThreadId,
	message,
	createdAt,
}: messageSystemCreateFx.Props) => {
	return withTransactionFx(
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

			yield* Effect.tryPromise(async () => {
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
			});
		}),
	);
};

export type messageSystemCreateFx = ReturnType<typeof messageSystemCreateFx>;
