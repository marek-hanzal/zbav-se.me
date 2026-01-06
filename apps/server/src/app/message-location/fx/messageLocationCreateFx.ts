import { genId } from "@use-pico/common/gen-id";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { messageUserCheckFx } from "~/@user/message-thread-user/fx/messageUserCheckFx";
import { messageLocationFetchFx } from "~/app/message-location/fx/messageLocationFetchFx";
import type { MessageLocationCreateSchema } from "~/app/message-location/schema/MessageLocationCreateSchema";
import type { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
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

type _NoUser = AssertNever<Extract<Effect.Effect.Context<messageLocationCreateFx>, UserContextFx>>;
