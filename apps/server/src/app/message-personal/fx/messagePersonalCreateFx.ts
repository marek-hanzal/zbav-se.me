import { genId } from "@use-pico/common/gen-id";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { messagePersonalFetchFx } from "~/app/message-personal/fx/messagePersonalFetchFx";
import type { MessagePersonalCreateSchema } from "~/app/message-personal/schema/MessagePersonalCreateSchema";
import { messageUserCheckFx } from "~/app/message-thread-user/fx/messageUserCheckFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

export namespace messagePersonalCreateFx {
	export interface Props extends MessagePersonalCreateSchema.Type {
		userId: string;
	}
}

export const messagePersonalCreateFx = Effect.fn("messagePersonalCreateFx")(function* ({
	userId,
	messageThreadId,
	name,
	phone,
	email,
	locationId,
}: messagePersonalCreateFx.Props) {
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
					.insertInto("message_personal")
					.values({
						id,
						messageThreadId,
						userId,
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
				userId,
				scope: {
					userId,
				},
			});
		}),
	);
});

export type messagePersonalCreateFx = ReturnType<typeof messagePersonalCreateFx>;

