import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { messagePersonalFetchFx } from "~/@user/message-personal/fx/messageFetchFx";
import { messageUserCheckFx } from "~/@user/message-thread-user/fx/messageUserCheckFx";
import type { MessagePersonalCreateSchema } from "~/app/message-personal/schema/MessagePersonalCreateSchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

export namespace messagePersonalCreateFx {
	export interface Props extends MessagePersonalCreateSchema.Type {}
}

export const messagePersonalCreateFx = Effect.fn("messagePersonalCreateFx")(function* ({
	messageThreadId,
	name,
	phone,
	email,
	locationId,
}: messagePersonalCreateFx.Props) {
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
					.insertInto("message_personal")
					.values({
						id,
						messageThreadId,
						userId: user.id,
						name,
						phone,
						email,
						locationId,
						createdAt: new Date(),
					})
					.returningAll()
					.executeTakeFirstOrThrow();
			});

			return yield* messagePersonalFetchFx({
				where: {
					id,
				},
			});
		}),
	);
});

export type messagePersonalCreateFx = ReturnType<typeof messagePersonalCreateFx>;
