import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { messageDateFetchFx } from "~/@user/message-date/fx/messageDateFetchFx";
import { messageUserCheckFx } from "~/@user/message-thread-user/fx/messageUserCheckFx";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import type { MessageDateCreateSchema } from "../schema/MessageDateCreateSchema";

export namespace messageDateCreateFx {
	export interface Props extends MessageDateCreateSchema.Type {}
}

export const messageDateCreateFx = ({ messageThreadId, datetime }: messageDateCreateFx.Props) => {
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
					.insertInto("message_date")
					.values({
						id,
						messageThreadId,
						userId: user.id,
						datetime,
						createdAt: new Date(),
					})
					.returningAll()
					.executeTakeFirstOrThrow();
			});

			return yield* messageDateFetchFx({
				where: {
					id,
				},
			});
		}),
	);
};

export type messageDateCreateFx = ReturnType<typeof messageDateCreateFx>;
