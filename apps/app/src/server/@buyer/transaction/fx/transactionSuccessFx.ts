import { Effect } from "effect";
import { transactionFetchFx } from "~/server/@buyer/transaction/fx/transactionFetchFx";
import { inboxCreateFx } from "~/server/@user/inbox/fx/inboxCreateFx";
import { transactionResolveFx } from "~/server/@user/transaction/fx/transactionResolveFx";
import { transactionStatusMessageFx } from "~/server/@user/transaction/fx/transactionStatusMessageFx";
import { transactionUpdateStatusFx } from "~/server/@user/transaction/fx/transactionUpdateStatusFx";
import { userInteractionEventFx } from "~/server/@user/user-event/fx/userInteractionEventFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";

export namespace transactionSuccessFx {
	export interface Props {
		transactionId: string;
		userId: string;
	}
}

export const transactionSuccessFx = Effect.fn("transactionSuccessFx")(function* ({
	userId,
	transactionId,
}: transactionSuccessFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const transaction = yield* transactionResolveFx({
				userId,
				transactionId,
				message: "You are not allowed to mark this listing transaction as successful",
			});

			yield* transactionUpdateStatusFx({
				transactionId: transaction.id,
				status: transaction.status,
				request: "success",
				target: "buyer",
			});

			yield* transactionStatusMessageFx({
				transactionId: transaction.id,
				request: "success",
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
				event: "transaction.success",
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

export type transactionSuccessFx = ReturnType<typeof transactionSuccessFx>;
