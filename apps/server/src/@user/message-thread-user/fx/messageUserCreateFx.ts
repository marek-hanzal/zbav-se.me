import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

export namespace messageUserCreateFx {
	export interface Props {
		messageThreadId: string;
		userIds: string[];
	}
}

export const messageUserCreateFx = ({ messageThreadId, userIds }: messageUserCreateFx.Props) => {
	return withTransactionFx(
		Effect.gen(function* () {
			const database = yield* DatabaseContextFx;

			return yield* Effect.tryPromise(async () => {
				return database
					.insertInto("message_thread_user")
					.values(
						userIds.map((userId) => ({
							id: genId(),
							messageThreadId,
							userId,
							createdAt: new Date(),
						})),
					)
					.returningAll()
					.execute();
			});
		}),
	);
};

export type messageUserCreateFx = ReturnType<typeof messageUserCreateFx>;
