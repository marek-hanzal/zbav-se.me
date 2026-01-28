import { DateContextFx } from "@use-pico/common/date";
import { Effect } from "effect";
import { transactionStatusGateFx } from "~/@user/transaction-status/fx/transactionStatusGateFx";
import { TransactionContextFx } from "~/@common/transaction/context/TransactionContextFx";
import { messagePersonalCreateFx } from "~/@user/message-personal/fx/messagePersonalCreateFx";
import type { TransactionMessagePersonalCreateSchema } from "~/@user/transaction-message-personal/schema/TransactionMessagePersonalCreateSchema";
import { userInteractionEventFx } from "~/@user/user-event/fx/userInteractionEventFx";
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
