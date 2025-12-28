import { Effect } from "effect";
import { DateTime } from "luxon";
import { messageDateCreateFx } from "~/@user/message-date/fx/messageDateCreateFx";
import { TransactionContextFx } from "~/@user/transaction/fx/TransactionContextFx";
import { transactionStatusGateFx } from "~/@user/transaction/fx/transactionStatusGateFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import type { TransactionMessageDateCreateSchema } from "../schema/TransactionMessageDateCreateSchema";

export namespace transactionMessageDateCreateFx {
	export interface Props extends TransactionMessageDateCreateSchema.Type {}
}

export const transactionMessageDateCreateFx = ({
	transactionId,
	datetime,
}: transactionMessageDateCreateFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const config = yield* TransactionContextFx;

		const transaction = yield* transactionStatusGateFx({
			transactionId,
			allowedStatuses: [
				"open",
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

		return yield* messageDateCreateFx({
			messageThreadId: transaction.messageThreadId,
			datetime,
		});
	});
};

export type transactionMessageDateCreateFx = ReturnType<typeof transactionMessageDateCreateFx>;
