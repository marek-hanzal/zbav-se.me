import { Effect } from "effect";
import { messageSystemCreateFx } from "~/@user/message-system/fx/messageSystemCreateFx";
import { transactionPatchFx } from "~/app/transaction/fx/transactionPatchFx";
import { transactionResolveFx } from "~/app/transaction/fx/transactionResolveFx";
import { transactionStatusCreateFx } from "~/app/transaction-status/fx/transactionStatusCreateFx";
import type { TransactionStatusResolveSchema } from "~/app/transaction-status/schema/TransactionStatusResolveSchema";
import { userInteractionEventFx } from "~/app/user-event/fx/userInteractionEventFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { InvalidRequestError } from "~/error/InvalidRequestError";

export namespace transactionStatusResolveFx {
	export interface Props extends TransactionStatusResolveSchema.Type {
		userId: string;
	}
}

export const transactionStatusResolveFx = Effect.fn("transactionStatusResolveFx")(function* ({
	userId,
	transactionId,
}: transactionStatusResolveFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const transaction = yield* transactionResolveFx({
				userId,
				transactionId,
				message: "You are not allowed to resolve this listing transaction",
			});

			if (transaction.side === "buyer") {
				return yield* new InvalidRequestError({
					message: "Buyer cannot resolve a transaction",
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
				text: "Seller resolved the transaction (message)",
			});

			yield* userInteractionEventFx({
				userId,
				targetId: transaction.buyerId,
				source: "transaction",
				group: transaction.id,
				event: "transaction.resolved",
				isTerminal: false,
			});

			return yield* transactionStatusCreateFx({
				userId,
				transactionId: transaction.id,
				listingId: transaction.listingId,
				status: "resolved",
				side: transaction.side,
			});
		}),
	);
});

export type transactionStatusResolveFx = ReturnType<typeof transactionStatusResolveFx>;
