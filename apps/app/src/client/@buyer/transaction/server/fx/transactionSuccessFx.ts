import { Effect } from "effect";
import { transactionFetchFx } from "~/client/@buyer/transaction/server/fx/transactionFetchFx";
import { inboxCreateFx } from "~/client/@user/inbox/server/fx/inboxCreateFx";
import { transactionResolveFx } from "~/client/@user/transaction/server/fx/transactionResolveFx";
import { transactionStatusMessageFx } from "~/client/@user/transaction/server/fx/transactionStatusMessageFx";
import { transactionUpdateStatusFx } from "~/client/@user/transaction/server/fx/transactionUpdateStatusFx";
import { userInteractionEventFx } from "~/client/@user/user-event/server/fx/userInteractionEventFx";
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
