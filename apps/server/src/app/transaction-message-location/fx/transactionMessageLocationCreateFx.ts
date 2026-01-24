import { DateContextFx } from "@use-pico/common/date";
import { Effect } from "effect";
import { messageLocationCreateFx } from "~/@user/message-location/fx/messageLocationCreateFx";
import { TransactionContextFx } from "~/app/transaction/context/TransactionContextFx";
import { transactionStatusGateFx } from "~/app/transaction/fx/transactionStatusGateFx";
import type { TransactionMessageLocationCreateSchema } from "~/app/transaction-message-location/schema/TransactionMessageLocationCreateSchema";
import { userInteractionEventFx } from "~/app/user-event/fx/userInteractionEventFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

export namespace transactionMessageLocationCreateFx {
	export interface Props extends TransactionMessageLocationCreateSchema.Type {
		userId: string;
	}
}

export const transactionMessageLocationCreateFx = Effect.fn("transactionMessageLocationCreateFx")(
	function* ({ userId, transactionId, locationId }: transactionMessageLocationCreateFx.Props) {
		return yield* withTransactionFx(
			Effect.gen(function* () {
				const { kysely } = yield* KyselyContextFx;
				const config = yield* TransactionContextFx;
				const dateContext = yield* DateContextFx;

				const transaction = yield* transactionStatusGateFx({
					userId,
					transactionId,
					allowedStatuses: [
						"open",
						"dispute",
					],
				});

				const now = dateContext.now();

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

				return yield* messageLocationCreateFx({
					userId,
					messageThreadId: transaction.messageThreadId,
					locationId,
				});
			}),
		);
	},
);

export type transactionMessageLocationCreateFx = ReturnType<
	typeof transactionMessageLocationCreateFx
>;
