import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { transactionFetchFx } from "~/buyer/transaction/server/fx/transactionFetchFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { activityCreateFx } from "~/user/activity/server/fx/activityCreateFx";
import { transactionMessageActivityArchiveFx } from "~/user/transaction/server/fx/transactionMessageActivityArchiveFx";
import { transactionResolveFx } from "~/user/transaction/server/fx/transactionResolveFx";
import { transactionStatusMessageFx } from "~/user/transaction/server/fx/transactionStatusMessageFx";
import { transactionUpdateStatusFx } from "~/user/transaction/server/fx/transactionUpdateStatusFx";
import { userInteractionEventFx } from "~/user/user-event/server/fx/userInteractionEventFx";

export namespace transactionCloseFx {
	export interface Props {
		transactionId: string;
		userId: string;
	}
}

export const transactionCloseFx = Effect.fn("transactionCloseFx")(function* ({
	userId,
	transactionId,
}: transactionCloseFx.Props) {
	const logger = yield* getLoggerFx("transactionCloseFx", "transaction");
	logger.trace("Request", {
		userId,
		transactionId,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const transaction = yield* transactionResolveFx({
				userId,
				transactionId,
				message: "You are not allowed to close this listing transaction",
			});

			yield* transactionMessageActivityArchiveFx({
				listingId: transaction.listingId,
				transactionId: transaction.id,
				type: "seller-message",
				userId,
			});

			yield* transactionUpdateStatusFx({
				transactionId: transaction.id,
				status: transaction.status,
				request: "closed",
				target: transaction.side,
			});

			yield* transactionStatusMessageFx({
				transactionId: transaction.id,
				request: "closed",
				target: transaction.side,
				userId,
			});

			yield* activityCreateFx({
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
				event: "transaction.closed",
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

export type transactionCloseFx = ReturnType<typeof transactionCloseFx>;
