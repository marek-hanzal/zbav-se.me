import { Effect } from "effect";
import { DateTime } from "luxon";
import { messageTextCreateFx } from "~/@user/message-text/fx/messageCreateFx";
import { TransactionContextFx } from "~/@user/transaction/fx/TransactionContextFx";
import { transactionStatusGateFx } from "~/@user/transaction/fx/transactionStatusGateFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import type { TransactionMessageTextCreateSchema } from "../schema/TransactionMessageTextCreateSchema";

export namespace transactionMessageTextCreateFx {
	export interface Props extends TransactionMessageTextCreateSchema.Type {}
}

export const transactionMessageTextCreateFx = ({
	transactionId,
	message,
}: transactionMessageTextCreateFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const config = yield* TransactionContextFx;

		const transaction = yield* transactionStatusGateFx({
			transactionId,
			allowedStatuses: [
				"open",
				"dispute",
			],
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

		return yield* messageTextCreateFx({
			messageThreadId: transaction.messageThreadId,
			message,
		});
	});
};

export type transactionMessageTextCreateFx = ReturnType<typeof transactionMessageTextCreateFx>;
