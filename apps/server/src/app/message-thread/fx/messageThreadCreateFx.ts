import { genId } from "@use-pico/common/gen-id";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { messageThreadFetchFx } from "~/app/message-thread/fx/messageThreadFetchFx";
import type { MessageThreadCreateSchema } from "~/app/message-thread/schema/MessageThreadCreateSchema";
import type { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

export namespace messageThreadCreateFx {
	export type Props = MessageThreadCreateSchema.Type;
}

export const messageThreadCreateFx = Effect.fn("messageThreadCreateFx")(function* (
	_: messageThreadCreateFx.Props,
) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const database = yield* DatabaseContextFx;

			const id = genId();

			yield* Effect.promise(async () => {
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
				where: {
					id,
				},
				scope: {},
			});
		}),
	);
});

export type messageThreadCreateFx = ReturnType<typeof messageThreadCreateFx>;

type _NoUser = AssertNever<Extract<Effect.Effect.Context<messageThreadCreateFx>, UserContextFx>>;
