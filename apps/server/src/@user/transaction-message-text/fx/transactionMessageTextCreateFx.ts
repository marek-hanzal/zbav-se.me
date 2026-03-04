import { DateContextFx } from "@use-pico/common/date";
import { Effect } from "effect";
import { TransactionContextFx } from "~/@common/transaction/context/TransactionContextFx";
import { inboxCreateFx } from "~/@user/inbox/fx/inboxCreateFx";
import { messageTextCreateFx } from "~/@user/message-text/fx/messageTextCreateFx";
import type { TransactionMessageTextCreateSchema } from "~/@user/transaction-message-text/schema/TransactionMessageTextCreateSchema";
import { transactionStatusGateFx } from "~/@user/transaction-status/fx/transactionStatusGateFx";
import { userInteractionEventFx } from "~/@user/user-event/fx/userInteractionEventFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { withTraceFx } from "~/effect/withTraceFx";

export namespace transactionMessageTextCreateFx {
	export interface Props extends TransactionMessageTextCreateSchema.Type {
		userId: string;
	}
}

export const transactionMessageTextCreateFx = Effect.fn("transactionMessageTextCreateFx")(
	function* ({ userId, transactionId, message }: transactionMessageTextCreateFx.Props) {
		yield* withTraceFx({
			fx: "transactionMessageTextCreateFx",
			input: {
				userId,
				transactionId,
				message: "(redacted)",
			},
		});

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

				yield* tryDbFx(async () =>
					kysely
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
						.executeTakeFirst(),
				);

				yield* userInteractionEventFx({
					userId,
					targetId:
						transaction.side === "buyer" ? transaction.sellerId : transaction.buyerId,
					source: "transaction",
					group: transaction.id,
					event: "transaction.message",
					isTerminal: false,
				});

				yield* inboxCreateFx(
					transaction.side === "buyer"
						? {
								userId: transaction.sellerId,
								type: "buyer-message",
								payload: {
									type: "buyer-message",
									transactionId: transaction.id,
									listingId: transaction.listingId,
									messageThreadId: transaction.messageThreadId,
								},
								priority: "high",
							}
						: {
								userId: transaction.buyerId,
								type: "seller-message",
								payload: {
									type: "seller-message",
									transactionId: transaction.id,
									listingId: transaction.listingId,
									messageThreadId: transaction.messageThreadId,
								},
								priority: "high",
							},
				);

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
