import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { messageLocationFetchFx } from "~/@user/message-location/fx/messageLocationFetchFx";
import { messageUserCheckFx } from "~/@user/message-thread-user/fx/messageUserCheckFx";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import type { MessageLocationCreateSchema } from "../schema/MessageLocationCreateSchema";

export namespace messageLocationCreateFx {
	export interface Props extends MessageLocationCreateSchema.Type {}
}

export const messageLocationCreateFx = ({
	messageThreadId,
	locationId,
}: messageLocationCreateFx.Props) => {
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
					.insertInto("message_location")
					.values({
						id,
						messageThreadId,
						userId: user.id,
						locationId,
						createdAt: new Date(),
					})
					.returningAll()
					.executeTakeFirstOrThrow();
			});

			return yield* messageLocationFetchFx({
				where: {
					id,
				},
			});
		}),
	);
};

export type messageLocationCreateFx = ReturnType<typeof messageLocationCreateFx>;
