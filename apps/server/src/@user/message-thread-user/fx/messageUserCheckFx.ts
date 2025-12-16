import { Effect } from "effect";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { NotFoundError } from "~/error/NotFoundError";

export namespace messageUserCheckFx {
	export interface Props {
		userIds: string[];
		messageThreadId: string;
	}
}

export const messageUserCheckFx = ({ userIds, messageThreadId }: messageUserCheckFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;

		const result = yield* Effect.tryPromise(async () => {
			return database
				.selectFrom("message_thread_user as mtu")
				.select("mtu.userId")
				.where("mtu.messageThreadId", "=", messageThreadId)
				.where("mtu.userId", "in", userIds)
				.limit(1)
				.executeTakeFirst();
		});

		if (!result) {
			return yield* new NotFoundError({
				resource: "message-thread-user",
				resourceId: "(user-ids+messageThreadId)",
				message: "User is not in the related thread",
			});
		}
	});
};

export type messageUserCheckFx = ReturnType<typeof messageUserCheckFx>;
