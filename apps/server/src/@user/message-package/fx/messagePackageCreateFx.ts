import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { messagePackageFetchFx } from "~/@user/message-package/fx/messagePackageFetchFx";
import { messageUserCheckFx } from "~/@user/message-thread-user/fx/messageUserCheckFx";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import type { MessagePackageCreateSchema } from "../schema/MessagePackageCreateSchema";

export namespace messagePackageCreateFx {
	export interface Props extends MessagePackageCreateSchema.Type {}
}

export const messagePackageCreateFx = ({
	messageThreadId,
	link,
	number,
}: messagePackageCreateFx.Props) => {
	return withTransactionFx(
		Effect.gen(function* () {
			const database = yield* DatabaseContextFx;
			const user = yield* UserContextFx;

			yield* messageUserCheckFx({
				userIds: [
					user.id,
				],
				messageThreadId,
			});

			const id = genId();

			yield* Effect.tryPromise(async () => {
				return database
					.insertInto("message_package")
					.values({
						id,
						messageThreadId,
						userId: user.id,
						link,
						number,
						createdAt: new Date(),
					})
					.returningAll()
					.executeTakeFirstOrThrow();
			});

			return yield* messagePackageFetchFx({
				where: {
					id,
				},
			});
		}),
	);
};

export type messagePackageCreateFx = ReturnType<typeof messagePackageCreateFx>;
