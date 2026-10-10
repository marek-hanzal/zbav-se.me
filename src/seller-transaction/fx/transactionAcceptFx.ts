import { Effect } from "effect";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { transactionFetchFx } from "~/seller-transaction/fx/transactionFetchFx";
import { InvalidRequestErrorFx } from "~/server-error/error/InvalidRequestErrorFx";
import { activityCreateFx } from "~/user-activity/fx/activityCreateFx";
import { userInteractionEventFx } from "~/user-event/fx/userInteractionEventFx";
import { transactionMessageActivityArchiveFx } from "~/user-transaction/fx/transactionMessageActivityArchiveFx";
import { transactionResolveFx } from "~/user-transaction/fx/transactionResolveFx";
import { transactionStatusMessageFx } from "~/user-transaction/fx/transactionStatusMessageFx";
import { transactionUpdateStatusFx } from "~/user-transaction/fx/transactionUpdateStatusFx";

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
	const logger = yield* getLoggerFx("transactionAcceptFx");
	logger.trace("transactionAcceptFx", {
		userId,
		transactionId,
	});

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

			yield* transactionMessageActivityArchiveFx({
				listingId: transaction.listingId,
				transactionId: transaction.id,
				type: "buyer-message",
				userId,
			});

			yield* transactionUpdateStatusFx({
				transactionId: transaction.id,
				status: transaction.status,
				request: "trade",
				target: "seller",
			});

			yield* transactionStatusMessageFx({
				transactionId: transaction.id,
				request: "trade",
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
