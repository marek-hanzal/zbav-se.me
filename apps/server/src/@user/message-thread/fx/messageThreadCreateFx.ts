import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { messageThreadFetchFx } from "~/@user/message-thread/fx/messageThreadFetchFx";
import type { MessageThreadCreateSchema } from "~/app/message-thread/schema/MessageThreadCreateSchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

export namespace messageThreadCreateFx {
	export type Props = MessageThreadCreateSchema.Type;
}

export const messageThreadCreateFx = (_: messageThreadCreateFx.Props) => {
	return withTransactionFx(
		Effect.gen(function* () {
			const database = yield* DatabaseContextFx;

			const id = genId();

			yield* Effect.tryPromise(async () => {
				return database
					.insertInto("message_thread")
					.values({
						id,
						createdAt: new Date(),
						updatedAt: new Date(),
					})
					.returningAll()
					.executeTakeFirstOrThrow();
			});

			return yield* messageThreadFetchFx({
				query: {
					where: {
						id,
					},
				},
			});
		}),
	);
};

export type messageThreadCreateFx = ReturnType<typeof messageThreadCreateFx>;
