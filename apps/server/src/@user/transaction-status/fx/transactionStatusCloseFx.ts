import { Effect } from "effect";
import type { DateTime } from "luxon";
import { transactionPatchFx } from "~/@user/transaction/fx/transactionPatchFx";
import { transactionResolveFx } from "~/@user/transaction/fx/transactionResolveFx";
import { transactionStatusCreateFx } from "~/@user/transaction-status/fx/transactionStatusCreateFx";
import type { TransactionStatusCloseSchema } from "~/@user/transaction-status/schema/TransactionStatusCloseSchema";
import { userInteractionEventFx } from "~/@user/user-event/fx/userInteractionEventFx";
import { messageSystemCreateFx } from "~/app/message-system/fx/messageSystemCreateFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { InvalidRequestError } from "~/error/InvalidRequestError";
import type { AssertNever } from "@use-pico/common/type";

export namespace transactionStatusCloseFx {
	export interface Props extends TransactionStatusCloseSchema.Type {
		userId: string;
		createdAt?: DateTime;
	}
}

export const transactionStatusCloseFx = Effect.fn("transactionStatusCloseFx")(function* ({
	userId,
	transactionId,
	createdAt,
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
				updatedAt: createdAt,
				scope: {
					userId,
				},
			});

			yield* messageSystemCreateFx({
				userId,
				messageThreadId: transaction.messageThreadId,
				message: "Transaction closed (message)",
				createdAt,
			});

			yield* userInteractionEventFx({
				userId,
				targetId: transaction.sellerId,
				source: "transaction",
				group: transaction.id,
				event: "transaction.closed",
				isTerminal: true,
				createdAt,
			});

			return yield* transactionStatusCreateFx({
				userId,
				transactionId: transaction.id,
				listingId: transaction.listingId,
				status: "closed",
				side: transaction.side,
				createdAt,
			});
		}),
	);
});

export type transactionStatusCloseFx = ReturnType<typeof transactionStatusCloseFx>;

type _NoUser = AssertNever<Extract<Effect.Effect.Context<transactionStatusCloseFx>, UserContextFx>>;
