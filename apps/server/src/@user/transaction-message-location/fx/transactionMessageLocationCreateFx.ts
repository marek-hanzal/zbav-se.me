import { Effect } from "effect";
import { DateTime } from "luxon";
import { messageLocationCreateFx } from "~/@user/message-location/fx/messageLocationCreateFx";
import { TransactionContextFx } from "~/@user/transaction/fx/TransactionContextFx";
import { transactionStatusGateFx } from "~/@user/transaction/fx/transactionStatusGateFx";
import { userInteractionEventFx } from "~/@user/user-event/fx/userInteractionEventFx";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import type { TransactionMessageLocationCreateSchema } from "../schema/TransactionMessageLocationCreateSchema";

export namespace transactionMessageLocationCreateFx {
	export interface Props extends TransactionMessageLocationCreateSchema.Type {
		createdAt?: DateTime;
	}
}

export const transactionMessageLocationCreateFx = Effect.fn("transactionMessageLocationCreateFx")(
	function* ({ transactionId, locationId, createdAt }: transactionMessageLocationCreateFx.Props) {
		return yield* withTransactionFx(
			Effect.gen(function* () {
				const database = yield* DatabaseContextFx;
				const user = yield* UserContextFx;
				const config = yield* TransactionContextFx;

				const transaction = yield* transactionStatusGateFx({
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
					userId: user.id,
					targetId:
						transaction.side === "buyer" ? transaction.sellerId : transaction.buyerId,
					source: "transaction",
					group: transaction.id,
					event: "transaction.message",
					isTerminal: false,
					createdAt,
				});

				return yield* messageLocationCreateFx({
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
