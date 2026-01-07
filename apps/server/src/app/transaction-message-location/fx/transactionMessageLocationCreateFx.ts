import { Effect } from "effect";
import { DateTime } from "luxon";
import { messageLocationCreateFx } from "~/app/message-location/fx/messageLocationCreateFx";
import { TransactionContextFx } from "~/app/transaction/context/TransactionContextFx";
import { transactionStatusGateFx } from "~/app/transaction/fx/transactionStatusGateFx";
import type { TransactionMessageLocationCreateSchema } from "~/app/transaction-message-location/schema/TransactionMessageLocationCreateSchema";
import { userInteractionEventFx } from "~/app/user-event/fx/userInteractionEventFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

export namespace transactionMessageLocationCreateFx {
	export interface Props extends TransactionMessageLocationCreateSchema.Type {
		userId: string;
		createdAt?: DateTime;
	}
}

export const transactionMessageLocationCreateFx = Effect.fn("transactionMessageLocationCreateFx")(
	function* ({
		userId,
		transactionId,
		locationId,
		createdAt,
	}: transactionMessageLocationCreateFx.Props) {
		return yield* withTransactionFx(
			Effect.gen(function* () {
				const database = yield* DatabaseContextFx;
				const config = yield* TransactionContextFx;

				const transaction = yield* transactionStatusGateFx({
					userId,
					transactionId,
					allowedStatuses: [
						"open",
						"dispute",
					],
				});

				const now = createdAt ?? DateTime.now();

				yield* Effect.promise(async () => {
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

				yield* userInteractionEventFx({
					userId,
					targetId:
						transaction.side === "buyer" ? transaction.sellerId : transaction.buyerId,
					source: "transaction",
					group: transaction.id,
					event: "transaction.message",
					isTerminal: false,
					createdAt,
				});

				return yield* messageLocationCreateFx({
					userId,
					messageThreadId: transaction.messageThreadId,
					locationId,
					createdAt,
				});
			}),
		);
	},
);

export type transactionMessageLocationCreateFx = ReturnType<
	typeof transactionMessageLocationCreateFx
>;
