import { Effect } from "effect";
import { messageThreadFetchFx } from "~/@user/message-thread/fx/messageThreadFetchFx";
import type { MessageThreadPatchSchema } from "~/@user/message-thread/schema/MessageThreadPatchSchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

export namespace messageThreadPatchFx {
	export type Props = MessageThreadPatchSchema.Type;
}

export const messageThreadPatchFx = ({ patch, query }: messageThreadPatchFx.Props) => {
	return withTransactionFx(
		Effect.gen(function* () {
			const database = yield* DatabaseContextFx;

			const messageThread = yield* messageThreadFetchFx(query);

			yield* Effect.tryPromise(async () => {
				return database
					.updateTable("message_thread")
					.set({
						...patch,
						updatedAt: new Date(),
					})
					.where("id", "=", messageThread.id)
					.executeTakeFirst();
			});

			return yield* messageThreadFetchFx({
				where: {
					id: messageThread.id,
				},
			});
		}),
	);
};

export type messageThreadPatchFx = ReturnType<typeof messageThreadPatchFx>;
