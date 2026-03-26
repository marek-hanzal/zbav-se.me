import { Effect } from "effect";
import { transactionFetchFx } from "~/server/@seller/transaction/fx/transactionFetchFx";
import { inboxCreateFx } from "~/server/@user/inbox/fx/inboxCreateFx";
import { transactionResolveFx } from "~/server/@user/transaction/fx/transactionResolveFx";
import { transactionStatusMessageFx } from "~/server/@user/transaction/fx/transactionStatusMessageFx";
import { transactionUpdateStatusFx } from "~/server/@user/transaction/fx/transactionUpdateStatusFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";

export namespace transactionDisputeFx {
	export interface Props {
		transactionId: string;
		userId: string;
	}
}

export const transactionDisputeFx = Effect.fn("transactionDisputeFx")(function* ({
	userId,
	transactionId,
}: transactionDisputeFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const transaction = yield* transactionResolveFx({
				userId,
				transactionId,
				message: "You are not allowed to dispute this listing transaction",
			});

			yield* transactionUpdateStatusFx({
				transactionId: transaction.id,
				status: transaction.status,
				request: "dispute",
				target: "seller",
			});

			yield* transactionStatusMessageFx({
				transactionId: transaction.id,
				request: "dispute",
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

export type transactionDisputeFx = ReturnType<typeof transactionDisputeFx>;
