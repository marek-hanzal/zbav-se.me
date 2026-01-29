import { Effect } from "effect";
import { transactionPatchFx } from "~/@buyer-user/transaction/fx/transactionPatchFx";
import { transactionStatusCreateFx } from "~/@buyer-user/transaction-status/fx/transactionStatusCreateFx";
import type { TransactionStatusCloseSchema } from "~/@buyer-user/transaction-status/schema/TransactionStatusCloseSchema";
import { messageSystemCreateFx } from "~/@user/message-system/fx/messageSystemCreateFx";
import { transactionResolveFx } from "~/@user/transaction/fx/transactionResolveFx";
import { userInteractionEventFx } from "~/@user/user-event/fx/userInteractionEventFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { InvalidRequestError } from "~/error/InvalidRequestError";

export namespace transactionStatusCloseFx {
	export interface Props extends TransactionStatusCloseSchema.Type {
		userId: string;
	}
}

export const transactionStatusCloseFx = Effect.fn("transactionStatusCloseFx")(function* ({
	userId,
	transactionId,
}: transactionStatusCloseFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const transaction = yield* transactionResolveFx({
				userId,
				transactionId,
				message: "You are not allowed to close this listing transaction",
			});

			if (transaction.side === "seller") {
				return yield* new InvalidRequestError({
					message: "Seller cannot close a transaction",
				});
			}

			yield* transactionPatchFx({
				userId,
				patch: {},
				query: {
					where: {
						id: transaction.id,
					},
				},
				scope: {
					userId,
				},
			});

			yield* messageSystemCreateFx({
				userId,
				messageThreadId: transaction.messageThreadId,
				text: "Transaction closed (message)",
			});

			yield* userInteractionEventFx({
				userId,
				targetId: transaction.sellerId,
				source: "transaction",
				group: transaction.id,
				event: "transaction.closed",
				isTerminal: true,
			});

			return yield* transactionStatusCreateFx({
				userId,
				transactionId: transaction.id,
				listingId: transaction.listingId,
				status: "closed",
				side: transaction.side,
			});
		}),
	);
});

export type transactionStatusCloseFx = ReturnType<typeof transactionStatusCloseFx>;
