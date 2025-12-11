import { Effect } from "effect";
import { messageThreadFetchFx } from "~/@user/message-thread/fx/messageThreadFetchFx";
import type { MessageThreadPatchSchema } from "~/app/message-thread/schema/MessageThreadPatchSchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { NotFoundError } from "~/error/NotFoundError";

export namespace messageThreadPatchFx {
	export interface Props extends MessageThreadPatchSchema.Type {}
}

export const messageThreadPatchFx = ({ query }: messageThreadPatchFx.Props) => {
	return withTransactionFx(
		Effect.gen(function* () {
			const database = yield* DatabaseContextFx;

			const messageThread = yield* messageThreadFetchFx({
				query,
			});

			if (!messageThread) {
				return yield* new NotFoundError({
					resource: "message-thread",
					resourceId: "(query)",
					message: "Message thread not found",
				});
			}

			yield* Effect.tryPromise(async () => {
				return database
					.updateTable("message_thread")
					.set({
						updatedAt: new Date(),
					})
					.where("id", "=", messageThread.id)
					.returningAll()
					.executeTakeFirstOrThrow();
			});

			return yield* messageThreadFetchFx({
				query: {
					where: {
						id: messageThread.id,
					},
				},
			});
		}),
	);
};

export type messageThreadPatchFx = ReturnType<typeof messageThreadPatchFx>;
