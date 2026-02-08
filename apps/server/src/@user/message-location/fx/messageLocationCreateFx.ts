import { DateContextFx } from "@use-pico/common/date";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { messageLocationFetchFx } from "~/@user/message-location/fx/messageLocationFetchFx";
import type { MessageLocationCreateSchema } from "~/@user/message-location/schema/MessageLocationCreateSchema";
import { messageUserCheckFx } from "~/@user/message-thread-user/fx/messageUserCheckFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { withTraceFx } from "~/effect/withTraceFx";

export namespace messageLocationCreateFx {
	export interface Props extends MessageLocationCreateSchema.Type {
		userId: string;
	}
}

export const messageLocationCreateFx = Effect.fn("messageLocationCreateFx")(function* ({
	userId,
	messageThreadId,
	locationId,
}: messageLocationCreateFx.Props) {
	yield* withTraceFx({
		fx: "messageLocationCreateFx",
		input: { userId, messageThreadId, locationId },
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
					.insertInto("message_location")
					.values({
						id,
						messageThreadId,
						userId,
						locationId,
						createdAt: dateContext.now().toJSDate(),
					})
					.returningAll()
					.executeTakeFirstOrThrow();
			});

			return yield* messageLocationFetchFx({
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

export type messageLocationCreateFx = ReturnType<typeof messageLocationCreateFx>;
