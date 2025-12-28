import { Effect } from "effect";
import { DateTime } from "luxon";
import { messagePersonalCreateFx } from "~/@user/message-personal/fx/messageCreateFx";
import { TransactionContextFx } from "~/@user/transaction/fx/TransactionContextFx";
import { transactionFetchFx } from "~/@user/transaction/fx/transactionFetchFx";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import type { TransactionMessagePersonalCreateSchema } from "../schema/TransactionMessagePersonalCreateSchema";

export namespace transactionMessagePersonalCreateFx {
	export interface Props extends TransactionMessagePersonalCreateSchema.Type {}
}

export const transactionMessagePersonalCreateFx = ({
	transactionId,
	name,
	phone,
	email,
	locationId,
}: transactionMessagePersonalCreateFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;
		const config = yield* TransactionContextFx;

		const transaction = yield* transactionFetchFx({
			where: {
				id: transactionId,
				userId: user.id,
			},
		});

		const now = DateTime.now();

		yield* Effect.tryPromise(async () => {
			return database
				.updateTable("transaction")
				.set({
					updatedAt: now.toJSDate(),
					expiresAt: now
						.plus({
							days: config.extend,
						})
						.toJSDate(),
				})
				.where("id", "=", transaction.id)
				.executeTakeFirst();
		});

		return yield* messagePersonalCreateFx({
			messageThreadId: transaction.messageThreadId,
			name,
			phone,
			email,
			locationId,
		});
	});
};

export type transactionMessagePersonalCreateFx = ReturnType<
	typeof transactionMessagePersonalCreateFx
>;
