import { Effect } from "effect";
import { transactionFetchFx } from "~/server/@seller/transaction/fx/transactionFetchFx";
import { inboxCreateFx } from "~/server/@user/inbox/fx/inboxCreateFx";
import { transactionResolveFx } from "~/server/@user/transaction/fx/transactionResolveFx";
import { transactionStatusMessageFx } from "~/server/@user/transaction/fx/transactionStatusMessageFx";
import { transactionUpdateStatusFx } from "~/server/@user/transaction/fx/transactionUpdateStatusFx";
import { userInteractionEventFx } from "~/server/@user/user-event/fx/userInteractionEventFx";
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
