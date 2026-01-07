import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { messageLocationFetchFx } from "~/app/message-location/fx/messageLocationFetchFx";
import type { MessageLocationCreateSchema } from "~/app/message-location/schema/MessageLocationCreateSchema";
import { messageUserCheckFx } from "~/app/message-thread-user/fx/messageUserCheckFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

export namespace messageLocationCreateFx {
	export interface Props extends MessageLocationCreateSchema.Type {
		userId: string;
		createdAt?: DateTime;
	}
}

export const messageLocationCreateFx = Effect.fn("messageLocationCreateFx")(function* ({
	userId,
	messageThreadId,
	locationId,
	createdAt,
}: messageLocationCreateFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;

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
						createdAt: (createdAt ?? DateTime.now()).toJSDate(),
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
