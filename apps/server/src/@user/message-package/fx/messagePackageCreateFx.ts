import { DateContextFx } from "@use-pico/common/date";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { messagePackageFetchFx } from "~/@user/message-package/fx/messagePackageFetchFx";
import type { MessagePackageCreateSchema } from "~/@user/message-package/schema/MessagePackageCreateSchema";
import { messageUserCheckFx } from "~/@user/message-thread-user/fx/messageUserCheckFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

export namespace messagePackageCreateFx {
	export interface Props extends MessagePackageCreateSchema.Type {
		userId: string;
	}
}

export const messagePackageCreateFx = Effect.fn("messagePackageCreateFx")(function* ({
	userId,
	messageThreadId,
	...data
}: messagePackageCreateFx.Props) {
	yield* Effect.annotateLogsScoped({
		"messagePackageCreateFx.userId": userId,
		"messagePackageCreateFx.messageThreadId": messageThreadId,
		"messagePackageCreateFx.data": "(redacted)",
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
					.insertInto("message_package")
					.values({
						...data,
						id,
						messageThreadId,
						userId,
						createdAt: dateContext.now().toJSDate(),
					})
					.returningAll()
					.executeTakeFirstOrThrow();
			});

			return yield* messagePackageFetchFx({
				where: {
					id,
				},
				userId,
				scope: {
					userId,
				},
			});
		}),
	);
});

export type messagePackageCreateFx = ReturnType<typeof messagePackageCreateFx>;
