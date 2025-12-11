import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { messageThreadFetchFx } from "~/@user/message-thread/fx/messageThreadFetchFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

export namespace messageThreadCreateFx {
	export interface Props {
		id?: string;
	}
}

export const messageThreadCreateFx = ({ id }: messageThreadCreateFx.Props = {}) => {
	return withTransactionFx(
		Effect.gen(function* () {
			const database = yield* DatabaseContextFx;

			const messageThreadId = id ?? genId();

			yield* Effect.tryPromise(async () => {
				return database
					.insertInto("message_thread")
					.values({
						id: messageThreadId,
						createdAt: new Date(),
						updatedAt: new Date(),
					})
					.returningAll()
					.executeTakeFirstOrThrow();
			});

			return yield* messageThreadFetchFx({
				query: {
					where: {
						id: messageThreadId,
					},
				},
			});
		}),
	);
};

export type messageThreadCreateFx = ReturnType<typeof messageThreadCreateFx>;
