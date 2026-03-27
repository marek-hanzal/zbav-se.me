import { Effect } from "effect";
import { transactionFetchFx } from "~/@seller/transaction/server/fx/transactionFetchFx";
import { inboxCreateFx } from "~/@user/inbox/server/fx/inboxCreateFx";
import { transactionResolveFx } from "~/@user/transaction/server/fx/transactionResolveFx";
import { transactionStatusMessageFx } from "~/@user/transaction/server/fx/transactionStatusMessageFx";
import { transactionUpdateStatusFx } from "~/@user/transaction/server/fx/transactionUpdateStatusFx";
import { userInteractionEventFx } from "~/@user/user-event/server/fx/userInteractionEventFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { InvalidRequestErrorFx } from "~/server/error/InvalidRequestErrorFx";

export namespace transactionAcceptFx {
	export interface Props {
		transactionId: string;
		userId: string;
	}
}

export const transactionAcceptFx = Effect.fn("transactionAcceptFx")(function* ({
	userId,
	transactionId,
}: transactionAcceptFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const transaction = yield* transactionResolveFx({
				userId,
				transactionId,
				message: "You are not allowed to accept this listing transaction",
			});

			if (transaction.buyerId === userId) {
				return yield* new InvalidRequestErrorFx({
					message: "Buyer cannot accept their own transaction",
				});
			}

			yield* transactionUpdateStatusFx({
				transactionId: transaction.id,
				status: transaction.status,
				request: "open",
				target: "seller",
			});

			yield* transactionStatusMessageFx({
				transactionId: transaction.id,
				request: "open",
				target: "seller",
				userId,
			});

			yield* inboxCreateFx({
				userId: transaction.buyerId,
				reference: [
					transaction.listingId,
					transaction.id,
				],
				family: "transaction",
				type: "seller-message",
				payload: {
					transactionId: transaction.id,
				},
				priority: "high",
			});

			yield* userInteractionEventFx({
				userId,
				targetId: transaction.buyerId,
				source: "transaction",
				group: transaction.id,
				event: "transaction.open",
				isTerminal: false,
			});

			return yield* transactionFetchFx({
				where: {
					id: transaction.id,
				},
				scope: {
					userId,
				},
			});
		}),
	);
});

export type transactionAcceptFx = ReturnType<typeof transactionAcceptFx>;
