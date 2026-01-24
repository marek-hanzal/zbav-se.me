import { DateContextFx } from "@use-pico/common/date";
import { Effect } from "effect";
import { messageTextCreateFx } from "~/@user/message-text/fx/messageTextCreateFx";
import { TransactionContextFx } from "~/@user/transaction/context/TransactionContextFx";
import { transactionStatusGateFx } from "~/@user/transaction/fx/transactionStatusGateFx";
import type { TransactionMessageTextCreateSchema } from "~/app/transaction-message-text/schema/TransactionMessageTextCreateSchema";
import { userInteractionEventFx } from "~/app/user-event/fx/userInteractionEventFx";
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
