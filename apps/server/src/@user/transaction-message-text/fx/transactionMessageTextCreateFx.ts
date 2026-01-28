import { DateContextFx } from "@use-pico/common/date";
import { Effect } from "effect";
import { transactionStatusGateFx } from "~/@user/transaction-status/fx/transactionStatusGateFx";
import { TransactionContextFx } from "~/@common/transaction/context/TransactionContextFx";
import { messageTextCreateFx } from "~/@user/message-text/fx/messageTextCreateFx";
import type { TransactionMessageTextCreateSchema } from "~/@user/transaction-message-text/schema/TransactionMessageTextCreateSchema";
import { userInteractionEventFx } from "~/@user/user-event/fx/userInteractionEventFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

export namespace transactionMessageTextCreateFx {
	export interface Props extends TransactionMessageTextCreateSchema.Type {
		userId: string;
	}
}

export const transactionMessageTextCreateFx = Effect.fn("transactionMessageTextCreateFx")(
	function* ({ userId, transactionId, message }: transactionMessageTextCreateFx.Props) {
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

				return yield* messageTextCreateFx({
					userId,
					messageThreadId: transaction.messageThreadId,
					message,
				});
			}),
		);
	},
);

export type transactionMessageTextCreateFx = ReturnType<typeof transactionMessageTextCreateFx>;
