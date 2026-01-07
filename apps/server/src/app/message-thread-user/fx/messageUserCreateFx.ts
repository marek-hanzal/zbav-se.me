import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

export namespace messageUserCreateFx {
	export interface Props {
		messageThreadId: string;
		userIds: string[];
		createdAt?: DateTime;
	}
}

export const messageUserCreateFx = Effect.fn("messageUserCreateFx")(function* ({
	messageThreadId,
	userIds,
	createdAt,
}: messageUserCreateFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const kysely = yield* KyselyContextFx;

			return yield* Effect.promise(async () => {
				return kysely
					.insertInto("message_thread_user")
					.values(
						userIds.map((userId) => ({
							id: genId(),
							messageThreadId,
							userId,
							createdAt: (createdAt ?? DateTime.now()).toJSDate(),
						})),
					)
					.returningAll()
					.execute();
			});
		}),
	);
});

export type messageUserCreateFx = ReturnType<typeof messageUserCreateFx>;
