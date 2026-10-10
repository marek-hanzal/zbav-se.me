import { Effect } from "effect";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { transactionFetchFx } from "~/seller-transaction/fx/transactionFetchFx";
import { activityCreateFx } from "~/user-activity/fx/activityCreateFx";
import { userInteractionEventFx } from "~/user-event/fx/userInteractionEventFx";
import { transactionMessageActivityArchiveFx } from "~/user-transaction/fx/transactionMessageActivityArchiveFx";
import { transactionResolveFx } from "~/user-transaction/fx/transactionResolveFx";
import { transactionStatusMessageFx } from "~/user-transaction/fx/transactionStatusMessageFx";
import { transactionUpdateStatusFx } from "~/user-transaction/fx/transactionUpdateStatusFx";

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
	const logger = yield* getLoggerFx("transactionRejectFx");
	logger.trace("transactionRejectFx", {
		userId,
		transactionId,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const transaction = yield* transactionResolveFx({
				userId,
				transactionId,
				message: "You are not allowed to reject this listing transaction",
			});

			yield* transactionMessageActivityArchiveFx({
				listingId: transaction.listingId,
				transactionId: transaction.id,
				type: "buyer-message",
				userId,
			});

			yield* transactionUpdateStatusFx({
				transactionId: transaction.id,
				status: transaction.status,
				request: "rejected",
				target: "seller",
			});

			yield* transactionStatusMessageFx({
				transactionId: transaction.id,
				request: "rejected",
				target: "seller",
				userId,
			});

			yield* activityCreateFx({
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
