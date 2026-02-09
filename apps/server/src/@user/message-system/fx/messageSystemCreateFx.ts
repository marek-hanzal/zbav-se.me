import { DateContextFx } from "@use-pico/common/date";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { messageSystemFetchFx } from "~/@user/message-system/fx/messageSystemFetchFx";
import type { MessageSystemCreateSchema } from "~/@user/message-system/schema/MessageSystemCreateSchema";
import { messageUserCheckFx } from "~/@user/message-thread-user/fx/messageUserCheckFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { withTraceFx } from "~/effect/withTraceFx";

export namespace messageSystemCreateFx {
	export interface Props extends MessageSystemCreateSchema.Type {
		userId: string;
	}
}

export const messageSystemCreateFx = Effect.fn("messageSystemCreateFx")(function* ({
	userId,
	messageThreadId,
	...data
}: messageSystemCreateFx.Props) {
	yield* withTraceFx({
		fx: "messageSystemCreateFx",
		input: {
			userId,
			messageThreadId,
			...data,
		},
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
					.insertInto("message_system")
					.values({
						...data,
						id,
						messageThreadId,
						createdAt: dateContext.now().toJSDate(),
					})
					.returningAll()
					.executeTakeFirstOrThrow();
			});

			return yield* messageSystemFetchFx({
				where: {
					id,
				},
				scope: {},
			});
		}),
	);
});

export type messageSystemCreateFx = ReturnType<typeof messageSystemCreateFx>;
