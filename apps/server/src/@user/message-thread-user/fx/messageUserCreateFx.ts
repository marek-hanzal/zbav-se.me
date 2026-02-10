import { DateContextFx } from "@use-pico/common/date";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { ConflictErrorFx } from "~/error/ConflictErrorFx";

export namespace messageUserCreateFx {
	export interface Props {
		messageThreadId: string;
		userIds: string[];
	}
}

export const messageUserCreateFx = Effect.fn("messageUserCreateFx")(function* ({
	messageThreadId,
	userIds,
}: messageUserCreateFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;
			const dateContext = yield* DateContextFx;

			return yield* tryDbFx(
				async () => {
					const now = dateContext.now().toJSDate();
					return kysely
						.insertInto("message_thread_user")
						.values(
							userIds.map((userId) => ({
								id: genId(),
								messageThreadId,
								userId,
								createdAt: now,
							})),
						)
						.returningAll()
						.execute();
				},
				{
					"23505": (e) =>
						new ConflictErrorFx({
							message: "Message thread user already exists",
							cause: e,
						}),
				},
			);
		}),
	);
});

export type messageUserCreateFx = ReturnType<typeof messageUserCreateFx>;
