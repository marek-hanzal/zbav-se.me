import { Effect } from "effect";
import { DateTime } from "luxon";
import { messagePersonalCreateFx } from "~/@user/message-personal/fx/messageCreateFx";
import { TransactionContextFx } from "~/@user/transaction/fx/TransactionContextFx";
import { transactionStatusGateFx } from "~/@user/transaction/fx/transactionStatusGateFx";
import { userInteractionEventFx } from "~/@user/user-event/fx/userInteractionEventFx";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import type { TransactionMessagePersonalCreateSchema } from "../schema/TransactionMessagePersonalCreateSchema";

export namespace transactionMessagePersonalCreateFx {
	export interface Props extends TransactionMessagePersonalCreateSchema.Type {}
}

export const transactionMessagePersonalCreateFx = Effect.fn("transactionMessagePersonalCreateFx")(
	function* ({
		transactionId,
		name,
		phone,
		email,
		locationId,
	}: transactionMessagePersonalCreateFx.Props) {
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

				const now = DateTime.now();

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
				});

				return yield* messagePersonalCreateFx({
					messageThreadId: transaction.messageThreadId,
					name,
					phone,
					email,
					locationId,
				});
			}),
		);
	},
);

export type transactionMessagePersonalCreateFx = ReturnType<
	typeof transactionMessagePersonalCreateFx
>;
