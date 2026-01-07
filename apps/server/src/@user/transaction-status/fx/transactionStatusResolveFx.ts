import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import type { DateTime } from "luxon";
import { transactionStatusCreateFx } from "~/@user/transaction-status/fx/transactionStatusCreateFx";
import type { TransactionStatusResolveSchema } from "~/@user/transaction-status/schema/TransactionStatusResolveSchema";
import { messageSystemCreateFx } from "~/app/message-system/fx/messageSystemCreateFx";
import { transactionPatchFx } from "~/app/transaction/fx/transactionPatchFx";
import { transactionResolveFx } from "~/app/transaction/fx/transactionResolveFx";
import { userInteractionEventFx } from "~/app/user-event/fx/userInteractionEventFx";
import type { UserContextFx } from "~/auth/fx/UserContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { InvalidRequestError } from "~/error/InvalidRequestError";

export namespace transactionStatusResolveFx {
	export interface Props extends TransactionStatusResolveSchema.Type {
		userId: string;
		createdAt?: DateTime;
	}
}

export const transactionStatusResolveFx = Effect.fn("transactionStatusResolveFx")(function* ({
	userId,
	transactionId,
	createdAt,
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
				updatedAt: createdAt,
				scope: {
					userId,
				},
			});

			yield* messageSystemCreateFx({
				userId,
				messageThreadId: transaction.messageThreadId,
				message: "Seller resolved the transaction (message)",
				createdAt,
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
				createdAt,
			});
		}),
	);
});

export type transactionStatusResolveFx = ReturnType<typeof transactionStatusResolveFx>;

type _NoUser = AssertNever<
	Extract<Effect.Effect.Context<transactionStatusResolveFx>, UserContextFx>
>;
