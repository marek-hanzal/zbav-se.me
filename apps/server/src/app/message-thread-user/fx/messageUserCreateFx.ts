import { genId } from "@use-pico/common/gen-id";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
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
			const database = yield* DatabaseContextFx;

			return yield* Effect.promise(async () => {
				return database
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

