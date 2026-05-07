import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { transactionFetchFx } from "~/seller/transaction/server/fx/transactionFetchFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { activityCreateFx } from "~/user/activity/server/fx/activityCreateFx";
import { transactionMessageActivityArchiveFx } from "~/user/transaction/server/fx/transactionMessageActivityArchiveFx";
import { transactionResolveFx } from "~/user/transaction/server/fx/transactionResolveFx";
import { transactionStatusMessageFx } from "~/user/transaction/server/fx/transactionStatusMessageFx";
import { transactionUpdateStatusFx } from "~/user/transaction/server/fx/transactionUpdateStatusFx";
import { userInteractionEventFx } from "~/user/user-event/server/fx/userInteractionEventFx";

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
