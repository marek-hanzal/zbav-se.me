import { Effect } from "effect";
import { DateTime } from "luxon";
import { messagePersonalCreateFx } from "~/app/message-personal/fx/messagePersonalCreateFx";
import { TransactionContextFx } from "~/app/transaction/context/TransactionContextFx";
import { transactionStatusGateFx } from "~/app/transaction/fx/transactionStatusGateFx";
import type { TransactionMessagePersonalCreateSchema } from "~/app/transaction-message-personal/schema/TransactionMessagePersonalCreateSchema";
import { userInteractionEventFx } from "~/app/user-event/fx/userInteractionEventFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

export namespace transactionMessagePersonalCreateFx {
	export interface Props extends TransactionMessagePersonalCreateSchema.Type {
		userId: string;
	}
}

export const transactionMessagePersonalCreateFx = Effect.fn("transactionMessagePersonalCreateFx")(
	function* ({
		userId,
		transactionId,
		name,
		phone,
		email,
		locationId,
	}: transactionMessagePersonalCreateFx.Props) {
		return yield* withTransactionFx(
			Effect.gen(function* () {
				const { kysely } = yield* KyselyContextFx;
				const config = yield* TransactionContextFx;

				const transaction = yield* transactionStatusGateFx({
					userId,
					transactionId,
					allowedStatuses: [
						"open",
						"dispute",
					],
				});

				const now = DateTime.now();

				yield* Effect.promise(async () => {
					return kysely
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
				});

				return yield* messagePersonalCreateFx({
					userId,
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
