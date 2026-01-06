import { Effect } from "effect";
import type { DateTime } from "luxon";
import { messageSystemCreateFx } from "~/@user/message-system/fx/messageSystemCreateFx";
import { transactionPatchFx } from "~/@user/transaction/fx/transactionPatchFx";
import { transactionResolveFx } from "~/@user/transaction/fx/transactionResolveFx";
import { transactionStatusCreateFx } from "~/@user/transaction-status/fx/transactionStatusCreateFx";
import type { TransactionStatusSuccessSchema } from "~/@user/transaction-status/schema/TransactionStatusSuccessSchema";
import { userInteractionEventFx } from "~/@user/user-event/fx/userInteractionEventFx";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { InvalidRequestError } from "~/error/InvalidRequestError";

export namespace transactionStatusSuccessFx {
	export type Props = TransactionStatusSuccessSchema.Type & {
		createdAt?: DateTime;
	};
}

export const transactionStatusSuccessFx = Effect.fn("transactionStatusSuccessFx")(function* ({
	transactionId,
	createdAt,
}: transactionStatusSuccessFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const user = yield* UserContextFx;

			const transaction = yield* transactionResolveFx({
				transactionId,
				message: "You are not allowed to mark this listing transaction as successful",
			});

			if (transaction.side === "seller") {
				return yield* new InvalidRequestError({
					message: "Seller cannot mark a transaction as successful",
				});
			}

			yield* transactionPatchFx({
				patch: {},
				query: {
					where: {
						id: transaction.id,
					},
				},
				updatedAt: createdAt,
			});

			yield* messageSystemCreateFx({
				messageThreadId: transaction.messageThreadId,
				message: "Transaction successful (message)",
				createdAt,
			});

			yield* userInteractionEventFx({
				userId: user.id,
				targetId: transaction.sellerId,
				source: "transaction",
				group: transaction.id,
				event: "transaction.success",
				isTerminal: true,
				createdAt,
			});

			return yield* transactionStatusCreateFx({
				transactionId: transaction.id,
				listingId: transaction.listingId,
				status: "success",
				side: transaction.side,
				createdAt,
			});
		}),
	);
});

export type transactionStatusSuccessFx = ReturnType<typeof transactionStatusSuccessFx>;
