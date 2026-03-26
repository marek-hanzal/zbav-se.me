import { Effect } from "effect";
import { transactionFetchFx } from "~/server/@buyer/transaction/fx/transactionFetchFx";
import { inboxCreateFx } from "~/server/@user/inbox/fx/inboxCreateFx";
import { transactionResolveFx } from "~/server/@user/transaction/fx/transactionResolveFx";
import { transactionStatusMessageFx } from "~/server/@user/transaction/fx/transactionStatusMessageFx";
import { transactionUpdateStatusFx } from "~/server/@user/transaction/fx/transactionUpdateStatusFx";
import { userInteractionEventFx } from "~/server/@user/user-event/fx/userInteractionEventFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";

export namespace transactionRejectFx {
	export interface Props {
		transactionId: string;
		userId: string;
	}
}

export const transactionRejectFx = Effect.fn("transactionRejectFx")(function* ({
	userId,
	transactionId,
}: transactionRejectFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const transaction = yield* transactionResolveFx({
				userId,
				transactionId,
				message: "You are not allowed to reject this listing transaction",
			});

			yield* transactionUpdateStatusFx({
				transactionId: transaction.id,
				status: transaction.status,
				request: "rejected",
				target: "buyer",
			});

			yield* transactionStatusMessageFx({
				transactionId: transaction.id,
				request: "rejected",
				target: "buyer",
				userId,
			});

			yield* inboxCreateFx({
				userId: transaction.sellerId,
				reference: [
					transaction.listingId,
					transaction.id,
				],
				family: "transaction",
				type: "buyer-message",
				payload: {
					transactionId: transaction.id,
				},
				priority: "high",
			});

			yield* userInteractionEventFx({
				userId,
				targetId: transaction.sellerId,
				source: "transaction",
				group: transaction.id,
				event: "transaction.rejected",
				isTerminal: true,
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

export type transactionRejectFx = ReturnType<typeof transactionRejectFx>;
