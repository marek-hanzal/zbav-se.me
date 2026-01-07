import { genId } from "@use-pico/common/gen-id";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { messagePackageFetchFx } from "~/app/message-package/fx/messagePackageFetchFx";
import type { MessagePackageCreateSchema } from "~/app/message-package/schema/MessagePackageCreateSchema";
import { messageUserCheckFx } from "~/app/message-thread-user/fx/messageUserCheckFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
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
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const database = yield* DatabaseContextFx;

			yield* messageUserCheckFx({
				userIds: [
					userId,
				],
				messageThreadId,
			});

			const id = genId();

			yield* Effect.promise(async () => {
				return database
					.insertInto("message_package")
					.values({
						...data,
						id,
						messageThreadId,
						userId,
						createdAt: new Date(),
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

