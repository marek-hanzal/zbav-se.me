import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import type { DateTime } from "luxon";
import { transactionPatchFx } from "~/@user/transaction/fx/transactionPatchFx";
import { transactionResolveFx } from "~/@user/transaction/fx/transactionResolveFx";
import { transactionStatusCreateFx } from "~/@user/transaction-status/fx/transactionStatusCreateFx";
import type { TransactionStatusSuccessSchema } from "~/@user/transaction-status/schema/TransactionStatusSuccessSchema";
import { userInteractionEventFx } from "~/@user/user-event/fx/userInteractionEventFx";
import { messageSystemCreateFx } from "~/app/message-system/fx/messageSystemCreateFx";
import type { UserContextFx } from "~/auth/fx/UserContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { InvalidRequestError } from "~/error/InvalidRequestError";

export namespace transactionStatusSuccessFx {
	export interface Props extends TransactionStatusSuccessSchema.Type {
		userId: string;
		createdAt?: DateTime;
	}
}

export const transactionStatusSuccessFx = Effect.fn("transactionStatusSuccessFx")(function* ({
	userId,
	transactionId,
	createdAt,
}: transactionStatusSuccessFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const transaction = yield* transactionResolveFx({
				userId,
				transactionId,
				message: "You are not allowed to mark this listing transaction as successful",
			});

			if (transaction.side === "seller") {
				return yield* new InvalidRequestError({
					message: "Seller cannot mark a transaction as successful",
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
				message: "Transaction successful (message)",
				createdAt,
			});

			yield* userInteractionEventFx({
				userId,
				targetId: transaction.sellerId,
				source: "transaction",
				group: transaction.id,
				event: "transaction.success",
				isTerminal: true,
				createdAt,
			});

			return yield* transactionStatusCreateFx({
				userId,
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

type _NoUser = AssertNever<
	Extract<Effect.Effect.Context<transactionStatusSuccessFx>, UserContextFx>
>;
