import { Effect } from "effect";
import type { DateTime } from "luxon";
import { messageSystemCreateFx } from "~/@user/message-system/fx/messageSystemCreateFx";
import { transactionPatchFx } from "~/@user/transaction/fx/transactionPatchFx";
import { transactionResolveFx } from "~/@user/transaction/fx/transactionResolveFx";
import { transactionStatusCreateFx } from "~/@user/transaction-status/fx/transactionStatusCreateFx";
import type { TransactionStatusResolveSchema } from "~/@user/transaction-status/schema/TransactionStatusResolveSchema";
import { userInteractionEventFx } from "~/@user/user-event/fx/userInteractionEventFx";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { InvalidRequestError } from "~/error/InvalidRequestError";

export namespace transactionStatusResolveFx {
	export type Props = TransactionStatusResolveSchema.Type & {
		createdAt?: DateTime;
	};
}

export const transactionStatusResolveFx = Effect.fn("transactionStatusResolveFx")(function* ({
	transactionId,
	createdAt,
}: transactionStatusResolveFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const user = yield* UserContextFx;

			const transaction = yield* transactionResolveFx({
				transactionId,
				message: "You are not allowed to resolve this listing transaction",
			});

			if (transaction.side === "buyer") {
				return yield* new InvalidRequestError({
					message: "Buyer cannot resolve a transaction",
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
				message: "Seller resolved the transaction (message)",
				createdAt,
			});

			yield* userInteractionEventFx({
				userId: user.id,
				targetId: transaction.buyerId,
				source: "transaction",
				group: transaction.id,
				event: "transaction.resolved",
				isTerminal: false,
			});

			return yield* transactionStatusCreateFx({
				transactionId: transaction.id,
				listingId: transaction.listingId,
				status: "resolved",
				side: transaction.side,
				createdAt,
			});
		}),
	);
});

export type transactionStatusResolveFx = ReturnType<typeof transactionStatusResolveFx>;
