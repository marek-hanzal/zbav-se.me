import { Effect } from "effect";
import { transactionFetchFx } from "~/buyer-transaction/fx/transactionFetchFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { activityCreateFx } from "~/user-activity/fx/activityCreateFx";
import { userInteractionEventFx } from "~/user-event/fx/userInteractionEventFx";
import { transactionMessageActivityArchiveFx } from "~/user-transaction/fx/transactionMessageActivityArchiveFx";
import { transactionResolveFx } from "~/user-transaction/fx/transactionResolveFx";
import { transactionStatusMessageFx } from "~/user-transaction/fx/transactionStatusMessageFx";
import { transactionUpdateStatusFx } from "~/user-transaction/fx/transactionUpdateStatusFx";

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
	const logger = yield* getLoggerFx("transactionSuccessFx", "transaction");
	logger.trace("transactionSuccessFx", {
		userId,
		transactionId,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const transaction = yield* transactionResolveFx({
				userId,
				transactionId,
				message: "You are not allowed to mark this listing transaction as successful",
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
				request: "success",
				target: "buyer",
			});

			yield* transactionStatusMessageFx({
				transactionId: transaction.id,
				request: "success",
				target: "buyer",
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
