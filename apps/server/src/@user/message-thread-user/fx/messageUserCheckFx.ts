import { NotFoundErrorFx } from "@use-pico/common/error";
import { Effect } from "effect";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";
import { traceLogFx } from "~/effect/traceLogFx";

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
	const { kysely } = yield* KyselyContextFx;

	const result = yield* tryDbFx(async () =>
		kysely
			.selectFrom("message_thread_user as mtu")
			.select("mtu.userId")
			.where("mtu.messageThreadId", "=", messageThreadId)
			.where("mtu.userId", "in", userIds)
			.limit(1)
			.executeTakeFirst(),
	);

	if (!result) {
		yield* traceLogFx({
			level: "trace",
			message: "messageUserCheckFx",
			error: {
				resource: "message-thread-user",
				resourceId: "(user-ids+messageThreadId)",
				message: "User is not in the related thread",
			},
		});
		return yield* new NotFoundErrorFx({
			resource: "message-thread-user",
			resourceId: "(user-ids+messageThreadId)",
			message: "User is not in the related thread",
		});
	}

	return result;
});

export type messageUserCheckFx = ReturnType<typeof messageUserCheckFx>;
