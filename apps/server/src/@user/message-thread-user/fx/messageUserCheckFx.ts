import { NotFoundErrorFx } from "@use-pico/common/error";
import { Effect } from "effect";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace messageUserCheckFx {
	export interface Props {
		userIds: string[];
		messageThreadId: string;
	}
}

export const messageUserCheckFx = Effect.fn("messageUserCheckFx")(function* ({
	userIds,
	messageThreadId,
}: messageUserCheckFx.Props) {
	const database = yield* DatabaseContextFx;

	const result = yield* Effect.promise(async () => {
		return database
			.selectFrom("message_thread_user as mtu")
			.select("mtu.userId")
			.where("mtu.messageThreadId", "=", messageThreadId)
			.where("mtu.userId", "in", userIds)
			.limit(1)
			.executeTakeFirst();
	});

	if (!result) {
		return yield* new NotFoundErrorFx({
			resource: "message-thread-user",
			resourceId: "(user-ids+messageThreadId)",
			message: "User is not in the related thread",
		});
	}

	return result;
});

export type messageUserCheckFx = ReturnType<typeof messageUserCheckFx>;
