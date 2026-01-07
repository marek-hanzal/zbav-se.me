import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import type { DateTime } from "luxon";
import type { TransactionStatusCloseSchema } from "~/@user/transaction-status/schema/TransactionStatusCloseSchema";
import { messageSystemCreateFx } from "~/app/message-system/fx/messageSystemCreateFx";
import { transactionPatchFx } from "~/app/transaction/fx/transactionPatchFx";
import { transactionResolveFx } from "~/app/transaction/fx/transactionResolveFx";
import { transactionStatusCreateFx } from "~/app/transaction-status/fx/transactionStatusCreateFx";
import { userInteractionEventFx } from "~/app/user-event/fx/userInteractionEventFx";
import type { UserContextFx } from "~/auth/fx/UserContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { InvalidRequestError } from "~/error/InvalidRequestError";

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
