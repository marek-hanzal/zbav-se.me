import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { transactionFetchFx } from "~/seller/transaction/server/fx/transactionFetchFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { activityCreateFx } from "~/user/activity/server/fx/activityCreateFx";
import { transactionMessageActivityArchiveFx } from "~/user/transaction/server/fx/transactionMessageActivityArchiveFx";
import { transactionResolveFx } from "~/user/transaction/server/fx/transactionResolveFx";
import { transactionStatusMessageFx } from "~/user/transaction/server/fx/transactionStatusMessageFx";
import { transactionUpdateStatusFx } from "~/user/transaction/server/fx/transactionUpdateStatusFx";

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
	const logger = yield* getLoggerFx("transactionDisputeFx");
	logger.trace("transactionDisputeFx", {
		userId,
		transactionId,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const transaction = yield* transactionResolveFx({
				userId,
				transactionId,
				message: "You are not allowed to dispute this listing transaction",
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
				request: "dispute",
				target: "seller",
			});

			yield* transactionStatusMessageFx({
				transactionId: transaction.id,
				request: "dispute",
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
